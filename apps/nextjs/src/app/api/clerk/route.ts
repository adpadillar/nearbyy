import crypto from "crypto";
import type { WebhookEvent } from "@clerk/clerk-sdk-node";

import { db } from "@nearbyy/db";

import { env } from "~/env";

const secret = env.CLERK_SIGNING_KEY;

async function verifyRequest(req: Request) {
  const svixId = req.headers.get("svix-id") ?? req.headers.get("webhook-id");
  const svixTimestamp =
    req.headers.get("svix-timestamp") ?? req.headers.get("webhook-timestamp");
  const svixSignature =
    req.headers.get("svix-signature") ?? req.headers.get("webhook-signature");

  console.log("received headers: ", { svixId, svixTimestamp, svixSignature });

  if (!svixId || !svixTimestamp || !svixSignature || !req.body) {
    console.log("ERROR: missing headers");
    return false;
  }

  const body = await req.arrayBuffer();
  const decoder = new TextDecoder();
  const text = decoder.decode(body);

  console.log("raw body: ", text);

  const signedContent = `${svixId}.${svixTimestamp}.${text}`;
  const secretBytes = new Buffer(secret.split("_")[1]!, "base64");

  const signature = crypto
    .createHmac("sha256", secretBytes)
    .update(signedContent)
    .digest("base64");

  console.log("our signature: ", signature);

  const signatures = svixSignature.split(" ");
  for (const sig of signatures) {
    if (signature === sig) {
      console.log("signature verified: ", sig);
      return true;
    }
  }

  console.log("ERROR: signature not verified");
  return false;
}

export const POST = async (req: Request) => {
  const verified = await verifyRequest(req);

  if (!verified) {
    return new Response("invalid request", {
      status: 400,
    });
  }

  const evt = (await req.json()) as WebhookEvent;

  switch (evt.type) {
    case "user.created":
      {
        await db.drizzle.insert(db.schema.users).values({
          firstName: evt.data.first_name,
          lastName: evt.data.last_name,
          fullName: evt.data.first_name + " " + evt.data.last_name,
          id: evt.data.id,
          imageUrl: evt.data.image_url,
          primaryEmailAddressId: evt.data.primary_email_address_id,
          twoFactorEnabled: evt.data.two_factor_enabled,
          createdAt: evt.data.created_at,
          updatedAt: evt.data.updated_at,
        });

        for (const i of evt.data.email_addresses) {
          await db.drizzle.insert(db.schema.emails).values({
            emailAddress: i.email_address,
            id: i.id,
            isVerified: i.verification?.status === "verified",
            userId: evt.data.id,
          });
        }
      }
      break;
    case "user.deleted":
      {
        if (evt.data.deleted) {
          await db.drizzle
            .delete(db.schema.users)
            .where(db.helpers.eq(db.schema.users.id, evt.data.id!));
          await db.drizzle
            .delete(db.schema.emails)
            .where(db.helpers.eq(db.schema.emails.userId, evt.data.id!));
        }
      }
      break;
    case "user.updated":
      {
        await db.drizzle.update(db.schema.users).set({
          firstName: evt.data.first_name,
          lastName: evt.data.last_name,
          fullName: evt.data.first_name + " " + evt.data.first_name,
          id: evt.data.id,
          imageUrl: evt.data.image_url,
          primaryEmailAddressId: evt.data.primary_email_address_id,
          twoFactorEnabled: evt.data.two_factor_enabled,
          createdAt: evt.data.created_at,
          updatedAt: evt.data.updated_at,
        });

        const emailsDb = db.drizzle
          .select({ id: db.schema.emails.id })
          .from(db.schema.emails)
          .where(db.helpers.eq(db.schema.emails.userId, evt.data.id));
        const emailsClerk = evt.data.email_addresses.map(
          (element) => element.id,
        );

        for (const i of await emailsDb) {
          if (!emailsClerk.includes(i.id)) {
            await db.drizzle
              .delete(db.schema.emails)
              .where(db.helpers.eq(db.schema.emails.id, i.id));
          }

          for (const i of evt.data.email_addresses) {
            await db.drizzle
              .insert(db.schema.emails)
              .values({
                emailAddress: i.email_address,
                id: i.id,
                isVerified: i.verification?.status === "verified",
                userId: evt.data.id,
              })
              .onConflictDoUpdate({
                target: db.schema.emails.id,
                set: {
                  emailAddress: i.email_address,
                  id: i.id,
                  isVerified: i.verification?.status === "verified",
                  userId: evt.data.id,
                },
              });
          }
        }
      }
      break;
  }
  return new Response("all good", {
    status: 200,
  });
};

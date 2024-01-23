import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import type { IncomingMessage } from "http";
import type { WebhookRequiredHeaders } from "svix";
import { buffer } from "micro";
import { Webhook } from "svix";

import { db } from "@nearbyy/db";

import { env } from "~/env";

export const config = {
  api: {
    bodyParser: false,
  },
};

const secret = env.CLERK_SIGNING_KEY;

export const POST = async (req: IncomingMessage) => {
  const payload = (await buffer(req)).toString();
  const headers = req.headers as unknown as WebhookRequiredHeaders;

  const wh = new Webhook(secret);
  let evt;

  try {
    evt = wh.verify(payload, headers) as WebhookEvent;
  } catch (err) {
    return new Response("", {
      status: 400,
    });
  }
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
            isVerified: i.verification?.status == "verified",
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
                isVerified: i.verification?.status == "verified",
                userId: evt.data.id,
              })
              .onConflictDoUpdate({
                target: db.schema.emails.id,
                set: {
                  emailAddress: i.email_address,
                  id: i.id,
                  isVerified: i.verification?.status == "verified",
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

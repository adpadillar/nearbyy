import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import type { NextRequest } from "next/server";

import { db } from "@nearbyy/db";

export const POST = async (req: NextRequest) => {
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
          .select({ emailAdress: db.schema.emails.emailAddress })
          .from(db.schema.emails)
          .where(db.helpers.eq(db.schema.emails.userId, evt.data.id));
        const emailsClerk = evt.data.email_addresses.map(
          (element) => element.email_address,
        );

        for (const i of await emailsDb) {
          if (!emailsClerk.includes(i.emailAdress)) {
            await db.drizzle
              .delete(db.schema.emails)
              .where(
                db.helpers.eq(db.schema.emails.emailAddress, i.emailAdress),
              );
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
      return new Response("all good", {
        status: 200,
      });
  }
};

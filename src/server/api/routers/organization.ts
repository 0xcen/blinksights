import crypto from "crypto";
import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "../../db";
import { organizations, users } from "../../db/schema";

export const organizationRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const orgId = ctx.session?.user?.orgId;
    if (!orgId) {
      throw new Error("User not found or doesn't belong to an organization");
    }
    const org = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, orgId));
    return org[0] ?? null;
  }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session?.user) {
        throw new Error("User not found");
      }

      if (ctx.session?.user.orgId) {
        throw new Error("User already has an organization");
      }

      const { name, email } = input;
      const [org] = await db
        .insert(organizations)
        .values({
          name,
          email,
        })
        .returning({ id: organizations.id });

      await db
        .update(users)
        .set({ orgId: org?.id })
        .where(eq(users.id, ctx.session.user.id));

      return org;
    }),
  setApiKey: publicProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session?.user?.orgId) {
      throw new Error("User not found");
    }
    const apiKey = crypto.randomBytes(32).toString("hex");

    await db
      .update(organizations)
      .set({ apiKey })
      .where(
        and(
          eq(organizations.id, ctx.session.user.orgId),
          isNull(organizations.apiKey),
        ),
      );

    return {};
  }),
});

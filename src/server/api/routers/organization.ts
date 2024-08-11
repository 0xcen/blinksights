import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "../../db";
import { organizations, users } from "../../db/schema";

export const organizationRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { id } = input;
      const org = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, id));
      return org;
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
});

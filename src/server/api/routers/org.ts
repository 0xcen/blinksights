import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { blinks } from "../../../mock/blinks";
import { db } from "../../db";

export const orgRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { id } = input;
      const org = await db.select().from(org).where(eq(orgs.id, id));
      return org;
    }),
});

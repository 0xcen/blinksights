import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { BlinkWithOrg, type Blink } from "../../../types/actions";
import { db } from "../../db";
import { blinks } from "../../db/schema";

export const blinkRouter = createTRPCRouter({
  all: publicProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        pageSize: z.number().int().positive().default(10),
      }),
    )
    .query(
      async ({
        input,
        ctx,
      }): Promise<{
        blinks: Blink[];
        total: number;
        page: number;
        pageSize: number;
      }> => {
        const { page, pageSize } = input;
        const offset = (page - 1) * pageSize;

        const org = ctx.session?.org;

        if (!org?.id) {
          throw new Error("No organization found");
        }
        const [totalCount, paginatedBlinks] = await Promise.all([
          db
            .select({ count: sql<number>`count(*)` })
            .from(blinks)
            .where(eq(blinks.orgId, org.id))
            .then((result) => result[0]),
          db
            .select()
            .from(blinks)
            .where(eq(blinks.orgId, org.id))
            .orderBy(blinks.createdAt)
            .limit(pageSize)
            .offset(offset),
        ]);

        return {
          blinks: paginatedBlinks.map(
            (blink): BlinkWithOrg =>
              ({
                id: blink.id,
                orgId: blink.orgId,
                createdAt: blink.createdAt,
                ...(blink.actions as Blink),
              }) as unknown as BlinkWithOrg,
          ),
          total: totalCount?.count ?? 0,
          page,
          pageSize,
        };
      },
    ),

  get: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .query(async ({ input, ctx }): Promise<BlinkWithOrg> => {
      const { id } = input;
      const org = ctx.session?.org;

      if (!org?.id) {
        throw new Error("No organization found");
      }

      const [blink] = await db
        .select()
        .from(blinks)
        .where(and(eq(blinks.id, id), eq(blinks.orgId, org.id)))
        .limit(1);

      if (!blink) {
        throw new Error("Blink not found");
      }

      return {
        id: blink.id,
        orgId: blink.orgId,
        createdAt: String(blink.createdAt),
        ...(blink.actions as Blink),
      };
    }),
});

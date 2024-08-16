import { and, eq, gte, sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "../../db";
import { blinkEvents, blinks } from "../../db/schema";
import { Blink, BlinkWithOrg } from "../../../types/actions";

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
        blinks: BlinkWithOrg[];
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
        const [totalCountResult, paginatedBlinks] = await Promise.all([
          db
            .select({ count: sql<number>`count(*)::int` })
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

        const totalCount = totalCountResult?.count ?? 0;

        return {
          blinks: paginatedBlinks.map(
            (blink): BlinkWithOrg =>
              ({
                id: blink.id,
                orgId: blink.orgId,
                createdAt: blink.createdAt.toISOString(),
                ...(blink.actions as Blink),
              }) as BlinkWithOrg,
          ),
          total: totalCount,
          page,
          pageSize,
        };
      },
    ),

  get: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }): Promise<BlinkWithOrg> => {
      const { id } = input;
      const org = ctx.session?.org;

      if (!org?.id) {
        throw new Error("No organization found");
      }

      const blink = await db
        .select()
        .from(blinks)
        .where(and(eq(blinks.id, id), eq(blinks.orgId, org.id)))
        .limit(1)
        .then((results) => results[0]);

      if (!blink) {
        throw new Error("Blink not found");
      }

      return {
        id: blink.id,
        orgId: blink.orgId,
        createdAt: blink.createdAt.toISOString(),
        ...(blink.actions as Blink),
      };
    }),

  getBlinkAnalytics: publicProcedure
    .input(
      z.object({
        id: z.string(),
        timeRange: z.enum(["24h", "7d", "30d"]).optional().default("24h"),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { id: blinkId, timeRange } = input;
      const org = ctx.session?.org;

      if (!org?.id) {
        throw new Error("No organization found");
      }

      // Calculate the start date based on the timeRange
      const now = new Date();
      let startDate: Date | undefined;

      switch (timeRange) {
        case "24h":
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "7d":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }

      // Build the query
      // Build the query conditions
      const conditions = [
        eq(blinkEvents.blinkId, blinkId),
        eq(blinkEvents.orgId, org.id),
      ];
      if (startDate) {
        conditions.push(gte(blinkEvents.timestamp, startDate));
      }

      // Execute the query
      const events = await db
        .select()
        .from(blinkEvents)
        .where(and(...conditions));

      console.log('events ::::::::: ', events);

      return {
        blinkId,
        events,
        timeRange,
      };
    }),

    getAllEvents: publicProcedure
    .input(
      z.object({
        orgId: z.string(),
        timeRange: z.enum(["24h", "7d", "30d"]).optional().default("7d"),
      }),
    )
    .query(async ({ input }) => {
      const { orgId, timeRange } = input; 
      const now = new Date();
      let startDate: Date | undefined;

      switch (timeRange) {
        case "24h":
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "7d":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }

      const events = await db
        .select()
        .from(blinkEvents)
        .where(and(eq(blinkEvents.orgId, orgId), gte(blinkEvents.timestamp, startDate)))
        .then((result) => result);

      return {
        events,
      };
    }),
});

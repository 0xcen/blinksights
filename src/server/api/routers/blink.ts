import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { blinks } from "../../../mock/blinks";

export const blinkRouter = createTRPCRouter({
  all: publicProcedure
    .input(
      z.object({
        page: z.number().int().positive().default(1),
        pageSize: z.number().int().positive().default(10),
      }),
    )
    .query(({ input }) => {
      const { page, pageSize } = input;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedBlinks = blinks.slice(start, end);

      return {
        blinks: paginatedBlinks,
        total: blinks.length,
        page,
        pageSize,
      };
    }),
});

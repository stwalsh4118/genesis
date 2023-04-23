import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { ZodShape } from "@/server/api/trpc";
import type { Book } from "@/client";
import { GroupCollection } from "@prisma/client";

const bookShape: ZodShape<Book> = {
  title: z.string(),
  author: z.string(),
  pages: z.number().optional(),
  isbn10: z.string().optional(),
  isbn13: z.string().optional(),
  coverUrl: z.string().optional(),
  rating: z.number().optional(),
  review: z.string().optional(),
};

export const groupBooksRouter = createTRPCRouter({
  getGroupBook: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const groupBook = await ctx.prisma.groupBook.findUnique({
        where: {
          id: input.id,
        },
      });

      return groupBook;
    }),
});
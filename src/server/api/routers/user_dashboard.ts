import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { ZodShape } from "@/server/api/trpc";
import type { Book } from "@/client";

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

export const userDashboardRouter = createTRPCRouter({
  averageRating: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;

    const books = await ctx.prisma.user.findFirst({
      where: {
        id: user.id,
      },
      select: {
        books: {
          where: {
            rating: {
              gt: 0,
            },
          },
        },
      },
    });

    if (!books) {
      return 0;
    }

    const totalRating: number = books.books.reduce((acc, book) => {
      return acc + (book.rating || 0);
    }, 0);

    const averageRating = totalRating / books.books.length;

    return !!(averageRating % 1) ? averageRating.toFixed(2) : averageRating;
  }),
});

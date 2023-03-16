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
};

export const userBooksRouter = createTRPCRouter({
  getBooks: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const books = await ctx.prisma.user.findFirst({
        where: {
          id: input.userId,
        },
        select: {
          books: true,
        },
      });

      return books;
    }),

  addBook: protectedProcedure
    .input(
      z.object({
        book: z.object(bookShape),
        collectionId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      console.log(user);

      const userBook = await ctx.prisma.book.create({
        data: {
          userId: user.id,
          collectionId: input.collectionId,
          title: input.book.title,
          author: input.book.author,
          pages: input.book.pages,
          isbn10: input.book.isbn10,
          isbn13: input.book.isbn13,
          coverUrl: input.book.coverUrl,
        },
      });

      console.log(userBook);

      return userBook;
    }),
});

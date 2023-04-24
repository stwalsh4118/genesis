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
  genres: z.array(z.string()).optional(),
};

export const groupCollectionsRouter = createTRPCRouter({
  getGroupCollections: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const groupCollections = await ctx.prisma.groupCollection.findMany({
        where: {
          groupId: input.groupId,
        },
        include: {
          books: true,
        },
      });

      return groupCollections;
    }),

  addGroupCollection: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        groupId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const groupCollection = await ctx.prisma.groupCollection.create({
        data: {
          name: input.name,
          groupId: input.groupId,
        },
      });

      return groupCollection;
    }),

  deleteGroupCollection: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const groupCollection = await ctx.prisma.groupCollection.delete({
        where: {
          id: input.id,
        },
      });

      return groupCollection;
    }),

  addBookToGroupCollection: protectedProcedure
    .input(
      z.object({
        book: z.object(bookShape),
        groupId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const groupCollections = await ctx.prisma.group.findFirst({
        where: {
          id: input.groupId,
        },
        select: {
          groupCollections: true,
        },
      });

      let allCollection: GroupCollection | undefined;
      if (groupCollections) {
        allCollection = groupCollections.groupCollections.find(
          (collection) => collection.name === "All"
        );
      }

      if (!allCollection) {
        allCollection = await ctx.prisma.groupCollection.create({
          data: {
            name: "All",
            groupId: input.groupId,
          },
        });
      }

      const userBook = await ctx.prisma.groupBook.create({
        data: {
          title: input.book.title,
          author: input.book.author,
          pages: input.book.pages,
          isbn10: input.book.isbn10,
          isbn13: input.book.isbn13,
          coverUrl: input.book.coverUrl,
          groupCollection: {
            connect: {
              id: allCollection?.id,
            },
          },
        },
      });

      console.log(userBook);

      return userBook;
    }),
});

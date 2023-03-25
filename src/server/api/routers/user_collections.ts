import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userCollectionsRouter = createTRPCRouter({
  getCollections: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const collections = await ctx.prisma.user.findFirst({
        where: {
          id: input.userId,
        },
        select: {
          collections: {
            include: {
              books: true,
            },
          },
        },
      });

      return collections;
    }),

  addCollection: protectedProcedure
    .input(
      z.object({
        name: z.union([z.string(), z.array(z.string())]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      let data;
      if (typeof input.name === "string") {
        data = {
          userId: user.id,
          name: input.name,
        };
      } else {
        data = input.name.map((name) => {
          return {
            userId: user.id,
            name: name,
          };
        });
      }

      const userCollection = await ctx.prisma.collection.createMany({
        data: data,
        skipDuplicates: true,
      });

      return userCollection;
    }),

  deleteCollection: protectedProcedure
    .input(
      z.object({
        collectionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      const collection = await ctx.prisma.collection.findFirst({
        where: {
          id: input.collectionId,
          userId: user.id,
        },
      });

      if (!collection) {
        throw new Error("Cannot delete collection");
      }

      const userCollection = await ctx.prisma.collection.delete({
        where: {
          id: input.collectionId,
        },
      });

      return userCollection;
    }),

  addBooksToCollection: protectedProcedure
    .input(
      z.object({
        collectionId: z.string(),
        bookIds: z.union([z.string(), z.array(z.string())]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let data;
      if (typeof input.bookIds === "string") {
        data = {
          id: input.bookIds,
        };
      } else {
        data = input.bookIds.map((bookId) => {
          return {
            id: bookId,
          };
        });
      }

      const userCollection = await ctx.prisma.collection.update({
        where: {
          id: input.collectionId,
        },
        data: {
          books: {
            connect: data,
          },
        },
      });

      return userCollection;
    }),

  removeBooksFromCollection: protectedProcedure
    .input(
      z.object({
        collectionId: z.string(),
        bookIds: z.union([z.string(), z.array(z.string())]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let data;
      if (typeof input.bookIds === "string") {
        const bookCollections = await ctx.prisma.book.findFirst({
          where: {
            id: input.bookIds,
          },
          select: {
            collection: true,
          },
        });

        if (!bookCollections) {
          throw new Error("Cannot remove book from collection");
        } else if (bookCollections.collection.length === 1) {
          throw new Error("Cannot remove book from collection");
        }

        data = {
          id: input.bookIds,
        };
      } else {
        data = input.bookIds.map(async (bookId) => {
          const bookCollections = await ctx.prisma.book.findFirst({
            where: {
              id: bookId,
            },
            select: {
              collection: true,
            },
          });

          if (!bookCollections) {
            return {
              id: undefined,
            };
          } else if (bookCollections.collection.length === 1) {
            return {
              id: undefined,
            };
          }
          return {
            id: bookId,
          };
        });

        data = await Promise.all(data);
        data = data.filter((book) => book.id !== undefined);

        if (data.length === 0) {
          throw new Error("Cannot remove books from collection");
        }
      }

      const userCollection = await ctx.prisma.collection.update({
        where: {
          id: input.collectionId,
        },
        data: {
          books: {
            disconnect: data,
          },
        },
      });

      return userCollection;
    }),
});

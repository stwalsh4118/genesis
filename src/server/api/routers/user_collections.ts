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
});

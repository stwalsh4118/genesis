import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const groupRouter = createTRPCRouter({
  getGroup: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const group = await ctx.prisma.group.findUnique({
        where: {
          id: input.id,
        },
        include: {
          users: true,
          groupCollections: {
            include: {
              books: true,
            },
          },
        },
      });

      return group;
    }),

  getGroups: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;

    const groups = await ctx.prisma.group.findMany({
      where: {
        users: {
          some: {
            id: user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        pinnedBook: true,
        users: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return groups;
  }),

  addGroup: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      const group = await ctx.prisma.group.create({
        data: {
          name: input.name,
          users: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return group;
    }),

  updateGroup: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        pinnedBook: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const group = await ctx.prisma.group.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          pinnedBookId: input.pinnedBook,
        },
      });

      return group;
    }),
});

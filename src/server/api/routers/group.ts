import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

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
          ownerId: user.id,
          users: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return group;
    }),

  deleteGroup: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const group = await ctx.prisma.group.findUnique({
        where: {
          id: input.id,
        },
      });

      if (group?.ownerId !== user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User is not the owner of the group",
        });
      }

      const groupDeleted = await ctx.prisma.group.delete({
        where: {
          id: input.id,
        },
      });
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

  addUserToGroup: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;

      //check if user is already in the group
      const group = await ctx.prisma.group.findUnique({
        where: {
          id: input.id,
        },
        select: {
          users: {
            where: {
              id: user.id,
            },
          },
        },
      });

      //error if user is already in the group
      if (group?.users.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User is already in the group",
        });
      }

      const groupAdded = await ctx.prisma.group.update({
        where: {
          id: input.id,
        },
        data: {
          users: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return group;
    }),
});

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
    });

    return groups;
  }),
});

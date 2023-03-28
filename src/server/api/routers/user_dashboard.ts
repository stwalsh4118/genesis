import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

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

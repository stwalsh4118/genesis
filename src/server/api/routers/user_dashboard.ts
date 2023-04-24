import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { type PagesReadEventData } from "./events";
import { Book } from "@prisma/client";

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

  totalPagesRead: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;

    const books = await ctx.prisma.user.findFirst({
      where: {
        id: user.id,
      },
      select: {
        books: {
          where: {
            pages: {
              gt: 0,
            },
          },
        },
      },
    });

    if (!books) {
      return 0;
    }

    const totalPagesRead = books.books.reduce((acc, book) => {
      return acc + (book.pagesRead || 0);
    }, 0);

    return totalPagesRead;
  }),

  totalBooksFinished: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;

    const books = await ctx.prisma.user.findFirst({
      where: {
        id: user.id,
      },
      select: {
        books: {
          where: {
            pages: {
              gt: 0,
            },
          },
        },
      },
    });

    if (!books) {
      return 0;
    }

    const finishedBooks = books.books.filter((book) => {
      return (book.pages || 0) <= (book.pagesRead || 0);
    });

    return finishedBooks.length;
  }),

  pagesReadOverTime: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;

    const events = await ctx.prisma.user.findFirst({
      where: {
        id: user.id,
      },
      select: {
        events: true,
      },
    });

    if (!events) {
      return [];
    }

    const pagesReadEvents = events.events.filter((event) => {
      return (
        (event.eventData as unknown as PagesReadEventData).eventType ===
        "pages_read"
      );
    });

    // console.log(pagesReadEvents);

    return null;
  }),

  genresRead: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;

    const books = await ctx.prisma.user.findFirst({
      where: {
        id: user.id,
      },
      select: {
        books: true,
      },
    });

    if (!books) {
      return [];
    }

    const filteredBooks = books.books.filter((book: Book) => {
      return !book.genres?.includes("N/A");
    });

    const genres = new Map<string, number>();

    filteredBooks.forEach((book) => {
      book.genres?.forEach((genre) => {
        if (genres.has(genre)) {
          genres.set(genre, genres.get(genre)! + 1);
        } else {
          genres.set(genre, 1);
        }
      });
    });

    const genresObject: { name: string; count: number }[] = [];

    genres.forEach((value, key) => {
      genresObject.push({
        name: key,
        count: value,
      });
    });

    return genresObject;
  }),
});

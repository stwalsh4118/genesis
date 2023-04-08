import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { type Prisma } from "@prisma/client";

type EventType =
  | "book_finished"
  | "book_started"
  | "pages_read"
  | "review_added";

export interface EventData {
  eventType: EventType;
}

export interface BookEventData extends EventData {
  bookId: string;
}

export interface PagesReadEventData extends EventData {
  bookId: string;
  pagesRead: number;
}

const generateFakePagesReadEvents = (bookId: string) => {
  const events: PagesReadEventData[] = [];

  for (let i = 0; i < 10; i++) {
    events.push({
      eventType: "pages_read",
      bookId,
      pagesRead: Math.floor(Math.random() * 100),
    });
  }

  return events;
};

const generateFakeEventDates = (events: EventData[]) => {
  const eventDates: Date[] = [];

  for (let i = 0; i < events.length; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 360));
    eventDates.push(date);
  }

  return eventDates;
};

export const eventsRouter = createTRPCRouter({
  getEvents: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;

    const events = await ctx.prisma.event.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return events;
  }),

  addBookFinishedEvent: protectedProcedure
    .input(
      z.object({
        bookId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const eventData: BookEventData = {
        eventType: "book_finished",
        bookId: input.bookId,
      };

      const event = await ctx.prisma.event.create({
        data: {
          userId: user.id,
          eventData: eventData as unknown as Prisma.JsonObject,
        },
      });

      return event;
    }),

  addBookStartedEvent: protectedProcedure

    .input(
      z.object({
        bookId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const eventData: BookEventData = {
        eventType: "book_started",
        bookId: input.bookId,
      };

      const event = await ctx.prisma.event.create({
        data: {
          userId: user.id,
          eventData: eventData as unknown as Prisma.JsonObject,
        },
      });

      return event;
    }),

  addPagesReadEvent: protectedProcedure
    .input(
      z.object({
        bookId: z.string(),
        pagesRead: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const eventData: PagesReadEventData = {
        eventType: "pages_read",
        bookId: input.bookId,
        pagesRead: input.pagesRead,
      };

      const event = await ctx.prisma.event.create({
        data: {
          userId: user.id,
          createdAt: new Date(),
          eventData: eventData as unknown as Prisma.JsonObject,
        },
      });

      return event;
    }),

  addReviewAddedEvent: protectedProcedure
    .input(
      z.object({
        bookId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user;
      const eventData: BookEventData = {
        eventType: "review_added",
        bookId: input.bookId,
      };

      const event = await ctx.prisma.event.create({
        data: {
          userId: user.id,
          eventData: eventData as unknown as Prisma.JsonObject,
        },
      });

      return event;
    }),

  addFakeEvents: protectedProcedure.mutation(async ({ ctx }) => {
    const user = ctx.session.user;

    const book = await ctx.prisma.book.findFirst({
      where: {
        userId: user.id,
      },
    });

    const events: EventData[] = [];

    if (!book) {
      return false;
    }

    events.push(...generateFakePagesReadEvents(book.id));

    const eventDates = generateFakeEventDates(events);

    for (let i = 0; i < events.length; i++) {
      await ctx.prisma.event.create({
        data: {
          userId: user.id,
          eventData: events[i] as unknown as Prisma.JsonObject,
          createdAt: eventDates[i],
        },
      });
    }

    return true;
  }),
});

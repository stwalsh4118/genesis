import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { type Prisma } from "@prisma/client";

type EventType =
  | "book_finished"
  | "book_started"
  | "pages_read"
  | "review_added";

interface EventData {
  eventType: EventType;
}

export interface BookEventData extends EventData {
  bookId: string;
}

export interface PagesReadEventData extends EventData {
  bookId: string;
  pagesRead: number;
}

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
});

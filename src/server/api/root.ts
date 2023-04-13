import { createTRPCRouter } from "@/server/api/trpc";
import { userBooksRouter } from "./routers/user_books";
import { userCollectionsRouter } from "./routers/user_collections";
import { userDashboardRouter } from "./routers/user_dashboard";
import { eventsRouter } from "./routers/events";
import { groupCollectionsRouter } from "./routers/group_collections";
import { groupRouter } from "./routers/group";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user_books: userBooksRouter,
  user_collections: userCollectionsRouter,
  user_dashboard: userDashboardRouter,
  events: eventsRouter,
  group_collections: groupCollectionsRouter,
  group: groupRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

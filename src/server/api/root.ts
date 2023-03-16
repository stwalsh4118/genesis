import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "@/server/api/routers/example";
import { userBooksRouter } from "./routers/user_books";
import { userCollectionsRouter } from "./routers/user_collections";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  user_books: userBooksRouter,
  user_collections: userCollectionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

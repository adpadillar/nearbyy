import { keysRouter } from "./router/keys";
import { projectRouter } from "./router/projects";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  // define your routes here
  projects: projectRouter,
  keys: keysRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

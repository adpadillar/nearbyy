import { projectRouter } from "./router/projects";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  // define your routes here
  projects: projectRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

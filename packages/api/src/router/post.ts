import { createTRPCRouter, publicProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  all: publicProcedure.query(() => {
    // return ctx.db.select().from(schema.post).orderBy(desc(schema.post.id));
    return {
      posts: [
        {
          id: 1,
          title: "Hello world",
          content: "This is my first post",
        },
        {
          id: 2,
          title: "Hello world 2",
          content: "This is my second post",
        },
      ],
    };
  }),
});

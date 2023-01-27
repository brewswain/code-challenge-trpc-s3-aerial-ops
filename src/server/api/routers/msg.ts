import { z } from "zod";
import { observable } from "@trpc/server/observable";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const msgRouter = createTRPCRouter({
  // If this were an authenticated app, i believe protectedProcedure is more suitable here. Very basic findMany call,will test when I have my `add` function`
  list: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.message.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
  }),

  add: publicProcedure
    .input(z.object({ messageText: z.string(), image: z.string().optional() }))
    // Unsure if we need async here
    .mutation(async ({ input: { messageText, image }, ctx }) => {
      await ctx.prisma.message.create({
        data: {
          messageText,
          image,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.message.delete({
        where: {
          id: input.id,
        },
      });
    }),

  onSendMessage: publicProcedure.subscription(({ ctx }) => {
    return observable<{ createdAt: Date }>((emit) => {
      const onSendMessage = (data: { createdAt: Date }) => {
        emit.next(data);
      };

      ctx.ee.on("sendMessage", onSendMessage);

      return () => {
        ctx.ee.off("sendMessage", onSendMessage);
      };
    });
  }),
});

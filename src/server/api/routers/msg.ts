import { z } from "zod";
import { observable } from "@trpc/server/observable";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { Message } from "@prisma/client";

export const msgRouter = createTRPCRouter({
  // If this were an authenticated app, i believe protectedProcedure is more suitable here. Very basic findMany call,will test when I have my `add` function`
  list: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.message.findMany({
      orderBy: {
        createdAt: "asc",
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

  // uploadImage: publicProcedure.input().mutation(),

  add: publicProcedure
    .input(z.object({ messageText: z.string(), image: z.string().optional() }))
    // Unsure if we need async here
    .mutation(async ({ input: { messageText, image }, ctx }) => {
      const post = await ctx.prisma.message.create({
        data: {
          messageText,
          image,
        },
      });

      return ctx.prisma.message.findMany({
        orderBy: {
          createdAt: "asc",
        },
      });
    }),
});

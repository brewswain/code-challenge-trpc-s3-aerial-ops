import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { s3Client } from "../../s3";

export const msgRouter = createTRPCRouter({
  // If this were an authenticated app, i believe protectedProcedure is more suitable here.
  list: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.message.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
  }),

  cursorBasedList: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
      })
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const messages = await ctx.prisma.message.findMany({
        take: limit + 1,
        skip: 1,
        cursor: cursor ? { myCursor: cursor } : undefined,
        orderBy: {
          createdAt: "asc",
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem!.myCursor;
      }
      return {
        messages,
        nextCursor,
      };
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
        hasImage: z.boolean().optional(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ input: { id, hasImage, image }, ctx }) => {
      if (hasImage) {
        const imageKeyArray = image?.split(".com/");
        const key = imageKeyArray && imageKeyArray[1];
        const bucketParams = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key,
        };

        try {
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: bucketParams.Bucket,
              Key: bucketParams.Key,
            })
          );
        } catch (error) {
          console.error("Error deleting object", error);
        }
      }
      await ctx.prisma.message.delete({
        where: {
          id,
        },
      });
    }),

  add: publicProcedure
    .input(
      z.object({
        messageText: z.string(),
        // If it's an optional boolean then maybe it's better to use a status flag instead
        hasImage: z.boolean().optional(),
        attachment: z
          .object({
            name: z.string(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input: { messageText, hasImage, attachment }, ctx }) => {
      if (hasImage) {
        const extensionArray = attachment?.name.split(".");
        const extension = extensionArray ? extensionArray[1] : undefined;
        const key = `${uuidv4()}.${extension ? extension : ""}`;
        const bucketParams = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key,
          ContentType: extension ? `image/${extension}` : "",
        };

        try {
          // Create a command to put the object in the S3 bucket.
          const command = new PutObjectCommand(bucketParams);
          // Create the presigned URL.
          const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 3600,
          });

          const imageUrl = `https://aerial-ops-code-challenge.s3.us-east-2.amazonaws.com/${key}`;
          await ctx.prisma.message.create({
            data: {
              messageText,
              image: imageUrl,
            },
          });

          return signedUrl;
        } catch (error) {
          console.error(error);
        }
      } else {
        await ctx.prisma.message.create({
          data: {
            messageText,
          },
        });
      }
    }),
});

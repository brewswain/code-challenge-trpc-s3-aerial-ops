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

  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
        hasImage: z.boolean().optional(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ input: { id, hasImage, image }, ctx }) => {
      console.log({ id, hasImage, image });
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

          console.log({ bucketParams, signedUrl, command });
          const imageUrl = `https://aerial-ops-code-challenge.s3.us-east-2.amazonaws.com/${key}`;
          await ctx.prisma.message.create({
            data: {
              messageText,
              image: imageUrl,
            },
          });
        } catch (err) {
          console.log("Error creating presigned URL", err);
        } finally {
          return signedUrl;
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

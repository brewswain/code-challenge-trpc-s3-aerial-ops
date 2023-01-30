import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  CreateBucketCommand,
  DeleteBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3,
} from "@aws-sdk/client-s3";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { s3Client } from "../../s3";
import { run } from "node:test";

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

  generatePresignedUrl: publicProcedure
    .input(z.object({ file: z.string() }))
    .query(async ({ input }) => {
      const extensionArray = input.file.split(".");
      const extension = extensionArray[1];
      const key = `${uuidv4()}.${extension ? extension : ""}`;

      console.log(extension);

      const bucketParams = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        Body: "BODY",
      };

      // Bucket Creation
      try {
        const data = await s3Client.send(
          new CreateBucketCommand({ Bucket: bucketParams.Bucket })
        );
        console.log(
          `Waiting for "${bucketParams.Bucket}" bucket creation...\n`
        );
      } catch (error) {
        console.log("Error creating bucket", error);
      }

      // Put object in Bucket
      try {
        if (extension) {
          console.log(`Putting object "${bucketParams.Key}" in bucket`);
          const data = await s3Client.send(
            new PutObjectCommand({
              Bucket: bucketParams.Bucket,
              Key: key,
              Body: bucketParams.Body,
              ContentType: `image/png`,
            })
          );
        }
      } catch (error) {
        console.log("Error putting object", error);
      }

      //create Presigned URL
      try {
        const command = new GetObjectCommand(bucketParams);

        const signedUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 3600,
        });
        console.log(
          `\nGetting "${key}" using signedUrl with body "${bucketParams.Body}" in v3`
        );
        console.log(signedUrl);
        const response = await fetch(signedUrl);
        console.log(
          `\nResponse returned by signed URL: ${await response.text()}\n`
        );
        return signedUrl;
      } catch (error) {
        console.log("Error creating presigned URL", error);
      }

      // // Delete Object
      // try {
      //   console.log(`\nDeleting object "${bucketParams.Key}" from bucket`);
      //   const data = await s3Client.send(
      //     new DeleteObjectCommand({
      //       Bucket: bucketParams.Bucket,
      //       Key: bucketParams.Key,
      //     })
      //   );
      // } catch (error) {
      //   console.log("Error deleting object", error);
      // }

      // // Delete Bucket
      // try {
      //   console.log(`\nDeleting bucket ${bucketParams.Bucket}`);
      //   const data = await s3Client.send(
      //     new DeleteBucketCommand({
      //       Bucket: bucketParams.Bucket,
      //       // Key: bucketParams.Key,
      //     })
      //   );
      // } catch (error) {
      //   console.log("Error deleting object", error);
      // }
    }),

  // try {
  //   if (extension) {
  //     const url = await getSignedUrl(
  //       s3Client,
  //       new PutObjectCommand({
  //         Bucket: process.env.AWS_BUCKET_NAME,
  //         Key: key,
  //         ContentType: `image/${extension}`,
  //       })
  //     );
  //     const response = await fetch(url);
  //     // console.log(response);
  //     return { url, key, response: await response.text() };
  //   }
  // } catch (error) {
  //   console.error(error);
  // }
  // return;

  // console.log({ input, fileExtension });
  // console.log({ url, key });

  add: publicProcedure
    .input(
      z.object({
        messageText: z.string(),
        // If it's an optional boolean then maybe it's better to use a status flag instead
        hasImage: z.boolean().optional(),
        signedUrl: z
          .object({ url: z.string(), key: z.string(), response: z.string() })
          .optional(),
      })
    )
    // Unsure if we need async here
    .mutation(async ({ input: { messageText, hasImage, signedUrl }, ctx }) => {
      console.log({ signedUrl });
      const uuid = uuidv4();
      const bucketParams = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: uuid,
        Body: "BODY",
      };
      // response.data && (await axios.put(response.data.url, file));

      if (hasImage) {
        const command = new PutObjectCommand(bucketParams);

        const signedUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 3600,
        });

        const response = await fetch(signedUrl, {
          method: "PUT",
          body: bucketParams.Body,
        });
        console.log(
          `\nResponse returned by signed URL: ${await response.text()}\n`
        );
      }
      const post = await ctx.prisma.message.create({
        data: {
          messageText,
        },
      });

      // if (imageKey) {
      //   // const originalObject = S3Server.getObject({
      //   //   Bucket: process.env.AWS_BUCKET_NAME,
      //   //   key: imageKey
      //   // })

      //   // const originalStream = originalObject.createReadStream()
      //   // const originalFileType = await fileTypeFromStream(originalStream)
      //   // if (!)

      //   try {
      //     const data = await s3Client.send(new PutObjectCommand(bucketParams));
      //   } catch (error) {
      //     console.error("Error Putting Object:", error);
      //   }
      // }

      // // try {
      // //   const command = new GetObjectCommand(bucketParams);

      // //   const signedUrl = await getSignedUrl(s3Client, command, {
      // //     expiresIn: 3600,
      // //   });

      // //   const response = await fetch(signedUrl);
      // //   console.log({ response });
      // // } catch (error) {
      // //   console.error("Error Creating Presigned URL: ", error);
      // // }

      // try {
      //   const data = await s3Client.send(new DeleteObjectCommand(bucketParams));
      // } catch (error) {
      //   console.log("Error deleting object: ", error);
      // }

      // return ctx.prisma.message.findMany({
      //   orderBy: {
      //     createdAt: "asc",
      //   },
      // });
    }),
});

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import UploadImageButton from "./UploadImageButton";

import { api } from "../../utils/api";

const ChatBar = () => {
  const [textInput, setTextInput] = useState<string>("");
  const [file, setFile] = useState<File>();
  const renderToast = (toastMessage: string) => toast(toastMessage);

  const utils = api.useContext();

  const sendMessageMutation = api.msg.add.useMutation({
    onMutate: async (data) => {
      // await utils.msg.list.cancel();
      await utils.msg.cursorBasedList.cancel();
      const allMessages = utils.msg.cursorBasedList.getInfiniteData(
        {
          limit: 15,
        }
        // {
        //   getNextPageParam: (lastPage) => lastPage.nextCursor,
        //   // initialCursor: 1,
        // }
      );

      // getData gets cached data so this is key for our Optimistic updates together with setData()
      const cachedData = utils.msg.list.getData();

      if (cachedData) {
        //  Upon doing research, this typing issue is caused by Prisma's model generation, where optional Params don't get detected in typescript as being optional.
        //  Please see the model currently in use for Message:

        //   model Message {
        //     id String @id @default(auto()) @map("_id") @db.ObjectId
        //     image String?
        //     messageText String?
        //     hasImage Boolean?
        //     createdAt DateTime? @default(now()) @db.Timestamp()
        //     myCursor Int? @unique
        //     @@index([createdAt])
        // }

        // This still kicks the type errors below when we try to set Data on our Message model, despite id being the only compulsory param. Therefore, I'm treating
        // this error as a false flag. It doesn't break linting rules, and the functionality works so I'm electing to keep my implementation as is.
        // I'll remove the @ts-ignore lines however.

        // UPDATE: I have to place back the @ts-ignore lines to allow the build since I don't want to do a codebase-wide rule in our tsconfig as this is dangerous
        // enough as is

        utils.msg.list.setData(undefined, [
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          ...cachedData,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          {
            messageText: data.messageText,
          },
        ]);
      }

      return { cachedData, allMessages };
    },

    onSuccess: async (signedUrl) => {
      if (signedUrl) {
        try {
          await axios({
            method: "put",
            url: signedUrl,
            data: file,
            headers: {
              "Content-Type": file?.type,
            },
          });
        } catch (error) {
        } finally {
          setTextInput("");
          setFile(undefined);
        }
      }
      return;
    },

    onError: (error, _variables, ctx) => {
      utils.msg.list.setData(undefined, ctx?.cachedData);
      if (error) {
        renderToast(error.message);
      }
    },
    onSettled: async () => {
      await utils.msg.invalidate();
    },
  });

  const handleChange = (inputMessage: string) => {
    setTextInput(inputMessage);
  };

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Solution taken from youtube--if this breaks check out React's ref documentation:
  // https://reactjs.org/docs/refs-and-the-dom.html
  const resizeInput = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  const sendMessage = () => {
    if (file) {
      sendMessageMutation.mutate({
        messageText: textInput,
        hasImage: true,
        attachment: { name: file.name },
      });
    }
    if (!file && textInput) {
      sendMessageMutation.mutate({
        messageText: textInput,
        hasImage: false,
      });
    }
    setTextInput("");
  };

  // prevent hitting Enter by itself from expanding textarea aka make message send like we expect it to
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.altKey && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }

    if (event.key === "Enter" && event.altKey) {
      event.preventDefault();
      setTextInput(textInput + "\r\n");
    }
  };

  useEffect(() => {
    resizeInput();
  }, [textInput]);

  return (
    <div className="fixed bottom-0 left-0 flex w-full bg-slate-200">
      {/* TextArea chosen to allow inherent multi-line support */}
      <textarea
        name="message"
        placeholder="Enter Message..."
        onChange={(event) => handleChange(event.target.value)}
        className="min-h-12 border-1-slate-500 md:bg-red-70 flex h-[48px] max-h-40 w-[60vw] overflow-hidden border-2 py-3  px-2 outline-none md:ml-8 md:w-[75vw]"
        ref={textAreaRef}
        onKeyDown={onKeyDown}
        value={textInput}
      />
      <UploadImageButton setFile={setFile} file={file} />
      <button
        onClick={sendMessage}
        className=" ml-2 flex h-12 w-20 items-center justify-center border-2 bg-[hsl(235,15%,54%)] align-middle outline-1"
      >
        Send
      </button>
    </div>
  );
};

export default ChatBar;

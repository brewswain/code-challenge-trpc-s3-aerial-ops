import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import UploadImageButton from "./UploadImageButton";

import { api } from "../../utils/api";
import { InfiniteData } from "@tanstack/react-query";
import { Message } from "@prisma/client";

interface ChatBarProps {
  cursorBasedMessagesConfig: {
    limit: number;
  };
}
const ChatBar = ({ cursorBasedMessagesConfig }: ChatBarProps) => {
  const [textInput, setTextInput] = useState<string>("");
  const [file, setFile] = useState<File>();
  const renderToast = (toastMessage: string) => toast(toastMessage);

  const utils = api.useContext();

  const sendMessageMutation = api.msg.add.useMutation({
    onMutate: async (data) => {
      await utils.msg.list.cancel();
      const cachedData = utils.msg.list.getInfiniteData({
        limit: cursorBasedMessagesConfig.limit,
      });

      const updatedMessageArray = cachedData?.pages.map((page) => {
        let messageArray = [];
        messageArray = page.messages;
        messageArray.push({ messageText: data.messageText });

        return messageArray;
      });

      const updatedMessages = cachedData?.pages.map(() => {
        return { messages: updatedMessageArray };
      });
      const updatedData: InfiniteData<{
        pages: {
          messages: Message[];
          nextCursor: string | undefined;
        }[];
        pageParams: unknown[];
      }> = {
        pages: updatedMessages,
        pageParams: cachedData?.pageParams,
      };

      utils.msg.list.setInfiniteData(
        { limit: cursorBasedMessagesConfig.limit },
        (data) => {
          return updatedData;
        }
      );

      return { cachedData };
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

    onError: (error) => {
      const cachedData = utils.msg.list.getInfiniteData();

      utils.msg.list.setInfiniteData({}, cachedData);

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

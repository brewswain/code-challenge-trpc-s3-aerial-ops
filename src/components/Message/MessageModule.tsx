import { useEffect, useState } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { Message } from "@prisma/client";
import { MdOutlineDeleteOutline } from "react-icons/md";

import ImageBox from "./ImageBox";
import MessageTimeStamp from "./MessageTimeStamp";

import { api } from "../../utils/api";

interface MessageModuleProps {
  message: Message;
  timestamp: string | null;
  scrollToBottom: () => void;
  cursorBasedMessagesConfig: {
    limit: number;
  };
}

const MessageModule = ({
  message,
  timestamp,
  scrollToBottom,
  cursorBasedMessagesConfig,
}: MessageModuleProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const utils = api.useContext();
  const renderToast = (toastMessage: string) => toast(toastMessage);

  const deleteMessageMutation = api.msg.delete.useMutation({
    onMutate: async (data) => {
      await utils.msg.list.cancel();
      const cachedData = utils.msg.list.getInfiniteData({
        limit: cursorBasedMessagesConfig.limit,
      });

      const filteredMessages = cachedData?.pages.map((page) => ({
        messages: page.messages.filter((message) => message.id !== data.id),
        nextCursor: page.nextCursor,
      }));

      const filteredData = {
        pages: filteredMessages,
        pageParams: cachedData!.pageParams,
      };

      utils.msg.list.setInfiniteData(
        { limit: cursorBasedMessagesConfig.limit },

        // See ChatBar.tsx ln 60 for my justification of using ts-ignore. Maybe some DTOs if I had more time
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        () => {
          return filteredData;
        }
      );

      return { cachedData };
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

  const handleDeletion = () => {
    deleteMessageMutation.mutate({
      id: message.id,
      hasImage: message.image ? true : false,
      image: message.image ? message.image : undefined,
    });
    return;
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <div
      className="md: relative mb-4 w-[60vw] p-2"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {isVisible && (
        <div className="absolute right-4 h-8 w-12 bg-[hsl(0,0%,75%)]">
          <div
            onClick={() => {
              handleDeletion();
            }}
            className="flex cursor-pointer justify-center  align-middle text-[2rem]"
          >
            <MdOutlineDeleteOutline />
          </div>
        </div>
      )}
      <p className="flex justify-center pb-2 pt-2 text-lg text-slate-400">
        {timestamp && timestamp.toString()}
      </p>
      <p className="pb-4 text-white">{message.messageText}</p>
      {message.image ? <ImageBox imageUrl={message.image} /> : null}

      <MessageTimeStamp createdAt={message.createdAt} />
    </div>
  );
};

export default MessageModule;

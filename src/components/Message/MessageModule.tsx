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
}

const MessageModule = ({
  message,
  timestamp,
  scrollToBottom,
}: MessageModuleProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const utils = api.useContext();
  const renderToast = (toastMessage: string) => toast(toastMessage);

  const deleteMessageMutation = api.msg.delete.useMutation({
    onMutate: async (data) => {
      await utils.msg.list.cancel();

      const cachedData = utils.msg.list.getData();

      const filteredData = cachedData?.filter(
        (message) => message.id !== data.id
      );

      if (cachedData) {
        // False flag as expanded upon in ChatBar.tsx line 26.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return utils.msg.list.setData(undefined, [...filteredData]);
      }

      return { cachedData };
    },

    onError: (error, _variables, ctx) => {
      // Error handling will be updated later to use toasts
      utils.msg.list.setData(undefined, ctx?.cachedData);

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

import { useState } from "react";
import type { Message } from "@prisma/client";
import { MdOutlineDeleteOutline } from "react-icons/md";

import ImageBox from "./ImageBox";
import MessageTimeStamp from "./MessageTimeStamp";

import { api } from "../../utils/api";

interface MessageModuleProps {
  message: Message;
  timestamp: string | null;
}

const MessageModule = ({ message, timestamp }: MessageModuleProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const utils = api.useContext();

  const deleteMessageMutation = api.msg.delete.useMutation({
    onMutate: async () => {
      await utils.msg.list.cancel();
    },

    onError: (error) => {
      alert(error);
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
  // Maybe delete from here
  return (
    <div
      className="md: relative w-[60vw] p-2"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {isVisible && (
        <div className="absolute right-4 h-8 w-12   bg-[hsl(0,0%,75%)] ">
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

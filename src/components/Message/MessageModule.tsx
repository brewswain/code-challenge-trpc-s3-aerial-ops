import { useState } from "react";
import type { Message } from "@prisma/client";

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
    deleteMessageMutation.mutate({ id: message.id });
    return;
  };
  // Maybe delete from here
  return (
    <div
      className="p-2"
      onClick={() => {
        handleDeletion();
      }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {isVisible && <div>delete icon</div>}
      <p className="flex justify-center">{timestamp && timestamp.toString()}</p>
      <p>{message.messageText}</p>
      {message.image ? <ImageBox imageUrl={message.image} /> : null}

      <MessageTimeStamp createdAt={message.createdAt} />
    </div>
  );
};

export default MessageModule;

import type { Message } from "@prisma/client";

import ImageBox from "./ImageBox";
import MessageTimeStamp from "./MessageTimeStamp";

interface MessageModuleProps {
  message: Message;
  timestamp: string | null;
}

const MessageModule = ({ message, timestamp }: MessageModuleProps) => {
  return (
    <div className="p-2">
      <p className="flex justify-center">{timestamp && timestamp.toString()}</p>
      <p>{message.messageText}</p>
      {message.image ? <ImageBox imageUrl={message.image} /> : null}

      <MessageTimeStamp createdAt={message.createdAt} />
    </div>
  );
};

export default MessageModule;

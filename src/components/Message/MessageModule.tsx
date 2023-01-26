import type { MessageProps } from "../../data/testData";
import ImageBox from "./ImageBox";
import MessageText from "./MessageText";
import MessageTimeStamp from "./MessageTimeStamp";

interface MessageModuleProps {
  message: MessageProps;
  timestamp: string | null;
}

const MessageModule = ({ message, timestamp }: MessageModuleProps) => {
  return (
    <div className="p-2">
      <p className="flex justify-center">{timestamp && timestamp.toString()}</p>
      <MessageText />
      {message.message.image ? (
        <ImageBox imageUrl={message.message.image} />
      ) : null}

      <MessageTimeStamp createdAt={message.message.createdAt} />
    </div>
  );
};

export default MessageModule;

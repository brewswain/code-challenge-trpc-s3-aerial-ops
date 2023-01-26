import type { MessageProps } from "../../data/testData";
import ImageBox from "./ImageBox";
import MessageText from "./MessageText";
import MessageTimeStamp from "./MessageTimeStamp";

const MessageModule = ({ message }: MessageProps) => {
  console.log(message.message);
  return (
    // Replace Fragments with proper container div once styling is decided upon
    <>
      <MessageText />
      {message.message.image ? (
        <ImageBox imageUrl={message.message.image} />
      ) : null}
      <MessageTimeStamp />
    </>
  );
};

export default MessageModule;

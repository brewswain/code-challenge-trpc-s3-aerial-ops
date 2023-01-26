import ImageBox from "./ImageBox";
import MessageText from "./MessageText";
import MessageTimeStamp from "./MessageTimeStamp";

const MessageModule = () => {
  return (
    // Replace Fragments with proper container div once styling is decided upon
    <>
      <MessageText />
      <ImageBox />
      <MessageTimeStamp />
    </>
  );
};

export default MessageModule;

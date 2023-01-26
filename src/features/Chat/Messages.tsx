import { ChatBar, MessageModule } from "../../components";

const Messages = () => {
  return (
    <div className="flex flex-col bg-background p-10">
      <MessageModule />
      <ChatBar />
    </div>
  );
};

export default Messages;

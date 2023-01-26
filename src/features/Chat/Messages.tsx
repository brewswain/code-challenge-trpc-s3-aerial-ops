import { ChatBar, MessageModule } from "../../components";

import type { MessageProps } from "../../data/testData";
import { testMessages } from "../../data/testData";

const Messages = () => {
  return (
    <div className="flex flex-col bg-background p-10">
      {testMessages.map((testMessage: MessageProps) => {
        console.log(testMessage);
        return (
          <MessageModule key={testMessage.message.id} message={testMessage} />
        );
      })}
      <ChatBar />
    </div>
  );
};

export default Messages;

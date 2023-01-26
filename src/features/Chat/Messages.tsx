import { ChatBar, MessageModule } from "../../components";

import type { MessageProps } from "../../data/testData";
import { testMessages } from "../../data/testData";

const Messages = () => {
  const getTimestamp = (messages: MessageProps[], index: number) => {
    const currentDate: Date = messages[index]!.message.createdAt;
    const previousDate =
      index !== 0 ? messages[index - 1]!.message.createdAt : null;

    if (previousDate) {
      // TODO: nested if statements 👎🏽 Fix when done, check for timestamp library
      if (
        previousDate.getDate() === currentDate.getDate() &&
        previousDate.getMonth() === currentDate.getMonth() &&
        previousDate.getFullYear() === previousDate.getFullYear()
      )
        return null;
    }

    return new Intl.DateTimeFormat([], {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(currentDate);
  };

  return (
    <div className="flex w-[50%] flex-col bg-white p-10">
      {testMessages.map((testMessage: MessageProps, index) => {
        const macroTimestamp = getTimestamp(testMessages, index);
        return (
          <MessageModule
            key={testMessage.message.id}
            message={testMessage}
            timestamp={macroTimestamp}
          />
        );
      })}
      <ChatBar />
    </div>
  );
};

export default Messages;

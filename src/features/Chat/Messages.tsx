import type { Message } from "@prisma/client";

import { ChatBar, MessageModule } from "../../components";

import { api } from "../../utils/api";

const Messages = () => {
  const messages = api.msg.list.useQuery();

  const getTimestamp = (messages: Message[], index: number) => {
    const currentDate: Date = messages[index]!.createdAt;
    const previousDate = index !== 0 ? messages[index - 1]!.createdAt : null;

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

  if (messages.isLoading || messages.error) {
    // Style loading text/replace with skeleton
    return (
      <div>
        <p>{messages.isLoading ? "Loading" : "Error"}</p>
      </div>
    );
  }

  return (
    <div className="flex w-[50%] flex-col overflow-auto bg-white p-10 ">
      {messages.data &&
        messages.data.map((message: Message, index) => {
          const macroTimestamp = getTimestamp(messages.data, index);

          return (
            <MessageModule
              key={message.id}
              message={message}
              timestamp={macroTimestamp}
            />
          );
        })}
      <ChatBar />
    </div>
  );
};

export default Messages;

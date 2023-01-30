/* eslint-disable react/no-unescaped-entities */
import type { Message } from "@prisma/client";
import { useRef } from "react";

import { ChatBar, MessageModule } from "../../components";

import { api } from "../../utils/api";

const Messages = () => {
  const messages = api.msg.list.useQuery();

  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
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
    // If this was a longer term project I'd set up Tailwind custom colours
    <div className="flex h-[calc(100vh-3rem)] w-full flex-col overflow-auto  bg-[hsl(220,8%,23%)] p-5">
      {messages.data.length < 1 && (
        <div className="flex h-[calc(100vh-12rem)] items-center justify-center text-2xl text-white">
          <p>Chat's looking pretty empty 😭 Why don't you help it out a bit?</p>
        </div>
      )}
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
      {/* Dummy div that gives us a location to scroll to */}
      <ChatBar scrollToBottom={scrollToBottom} />
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;

/* eslint-disable react/no-unescaped-entities */
import { useRef } from "react";
import type { Message } from "@prisma/client";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import moment from "moment";

import "react-loading-skeleton/dist/skeleton.css";

import { ChatBar, MessageModule } from "../../components";
import { api } from "../../utils/api";
import { toast } from "react-toastify";

const Messages = () => {
  const messages = api.msg.list.useQuery();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const renderToast = (toastMessage: string) => toast(toastMessage);

  const getTimestamp = (messages: Message[], index: number) => {
    const currentDate: string | undefined = moment(
      messages[index]?.createdAt
    ).format("MMMM Do, YYYY");
    const previousDate: string | null | undefined =
      index !== 0
        ? moment(messages[index - 1]?.createdAt).format("MMMM Do, YYYY")
        : null;

    if (currentDate === previousDate) {
      return null;
    }
    return currentDate;
  };

  const scrollToBottom = () => {
    // Identified problem -- Scroll occurs before post is made, causing this issue where it doesn't scroll fully.
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (messages.isLoading || messages.error) {
    // Style loading text/replace with skeleton
    return (
      <div className=" h-full bg-[hsl(220,8%,23%)]">
        <div className="flex h-[calc(100vh)] items-center justify-center text-2xl text-white">
          <p>
            Loading! This shouldn't take long, so please contact me if you're
            staring at this screen for more than 5 seconds 😔
            <SkeletonTheme baseColor="#202020" highlightColor="#444">
              <span>
                <Skeleton />
              </span>
            </SkeletonTheme>
          </p>
        </div>
      </div>
    );
  }

  return (
    // If this was a longer term project I'd set up Tailwind custom colours

    <>
      <div className="flex h-[calc(100vh-3rem)] w-full flex-col overflow-auto  bg-[hsl(220,8%,23%)] pt-5 pl-12">
        {messages.data.length < 1 && (
          <div className="flex h-[calc(100vh-12rem)] items-center justify-center text-2xl text-white">
            <p>
              Chat's looking pretty empty 😭 Why don't you help it out a bit?
            </p>
          </div>
        )}
        {messages.data &&
          messages.data.map((message: Message, index) => {
            const macroTimestamp = getTimestamp(messages.data, index);

            return (
              <MessageModule
                scrollToBottom={scrollToBottom}
                key={`${index} ${message.id}`}
                message={message}
                timestamp={macroTimestamp}
              />
            );
          })}

        {/* Dummy div that gives us a location to scroll to . I elected to use id instead of class here since I'm using 
        tailwind for styling and I wanted to label this div at a glance */}
        <div id="scroll__anchor-point" ref={messagesEndRef} />
        <ChatBar />
      </div>
    </>
  );
};

export default Messages;

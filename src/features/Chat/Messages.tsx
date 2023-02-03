/* eslint-disable react/no-unescaped-entities */
import { useRef, useCallback, useEffect } from "react";
import type { Message } from "@prisma/client";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import moment from "moment";

import "react-loading-skeleton/dist/skeleton.css";

import { ChatBar, MessageModule } from "../../components";
import { api } from "../../utils/api";

const Messages = () => {
  const nextMessagesObserverRef = useRef(null);
  const previousMessagesObserverRef = useRef(null);

  const cursorBasedMessagesConfig = {
    limit: 10,
  };
  const cursorBasedMessages = api.msg.list.useInfiniteQuery(
    { limit: cursorBasedMessagesConfig.limit },
    {
      getNextPageParam: (lastPage, allPages) => {
        const lastMessageIndex = cursorBasedMessagesConfig.limit - 1;

        const lastMessageId = lastPage
          ? lastPage.messages[lastMessageIndex]?.id
          : allPages[0]?.messages[lastMessageIndex]?.id;

        return lastMessageId;
      },
    }
  );

  // Going to try using an Intersection Observer For monitoring "Scroll position"--in this case it's actually monitoring for if
  // an observed element is visible or reaches a defined position, then fires a callback. This'll need useRef() and useCallback()
  // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
  const handleObserver = useCallback<IntersectionObserverCallback>(
    async (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target && target.isIntersecting && cursorBasedMessages.hasNextPage) {
        await cursorBasedMessages.fetchNextPage();
      } else {
        if (
          target &&
          target.isIntersecting &&
          cursorBasedMessages.hasPreviousPage
        ) {
          await cursorBasedMessages.fetchPreviousPage();
        }
      }
    },
    [cursorBasedMessages]
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const nextMessagesObserver = nextMessagesObserverRef.current;
    const previousMessagesObserver = previousMessagesObserverRef.current;
    const option = { threshold: 0 };

    const currentlyObservedElement = nextMessagesObserver
      ? nextMessagesObserver
      : previousMessagesObserver;
    const observer = new IntersectionObserver(handleObserver, option);

    if (currentlyObservedElement) {
      observer.observe(currentlyObservedElement);
      return () => observer.unobserve(currentlyObservedElement);
    }
  }, [
    cursorBasedMessages.fetchNextPage,
    cursorBasedMessages.hasNextPage,
    handleObserver,
  ]);

  if (cursorBasedMessages.isLoading || cursorBasedMessages.error) {
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
    <>
      <div className="flex h-[calc(100vh-3rem)] w-full flex-col overflow-auto  bg-[hsl(220,8%,23%)] pt-5 pl-12">
        {/* <div
          id="scroll__infinite-scroll-point h-2 w-2"
          ref={previousMessagesObserverRef}
        /> */}
        {cursorBasedMessages.data.pages.length < 1 && (
          <div className="flex h-[calc(100vh-12rem)] items-center justify-center text-2xl text-white">
            <p>
              Chat's looking pretty empty 😭 Why don't you help it out a bit?
            </p>
          </div>
        )}
        {cursorBasedMessages.data?.pages &&
          cursorBasedMessages.data?.pages.map((page) =>
            page.messages.map((message, index) => {
              const macroTimestamp = getTimestamp(page.messages, index);
              return (
                <MessageModule
                  scrollToBottom={scrollToBottom}
                  key={`${index} ${message.id}`}
                  cursorBasedMessagesConfig={cursorBasedMessagesConfig}
                  message={message}
                  timestamp={macroTimestamp}
                />
              );
            })
          )}

        {/* Dummy divs that gives us locations to scroll to . I elected to use id instead of class here since I'm using 
        tailwind for styling and I wanted to label these divs at a glance */}
        <div id="scroll__infinite-scroll-point" ref={nextMessagesObserverRef} />
        <div id="scroll__anchor-point" ref={messagesEndRef} />
        <ChatBar cursorBasedMessagesConfig={cursorBasedMessagesConfig} />
      </div>
    </>
  );
};

export default Messages;

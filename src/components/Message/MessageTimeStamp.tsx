import { useEffect, useState } from "react";

interface MessageTimeStampProps {
  createdAt: Date;
}

const MessageTimeStamp = ({ createdAt }: MessageTimeStampProps) => {
  const [timeStamp, setTimeStamp] = useState<string>("");
  // Detailed Timestamp block
  const locale = "en-us";
  const timestamp = new Intl.DateTimeFormat(locale, {
    minute: "numeric",
    hour: "numeric",
    year: "numeric",
    month: "short",
  }).format(createdAt);

  // Using weekday in our Intl.DateTimeFormat was causing day to show up in weird place,
  //  and I didn't want to use even more string manipulation
  const summarizedDay = createdAt.toLocaleDateString(locale, {
    weekday: "short",
  });

  const formattedTimestamp = summarizedDay + " " + timestamp.replace(",", " -");

  // Minimal timestamp: "X minutes ago"
  const previousMessageTimeInMinutes = Math.floor(
    createdAt.getTime() / (1000 * 60)
  );
  const currentTimeinMinutes = Math.floor(Date.now() / (1000 * 60));
  const timeSinceLastMessage =
    currentTimeinMinutes - previousMessageTimeInMinutes;

  // This current naive implementation will always show a stale timestamp since it'll just update once a new message
  // is sent. However, the fix will be easier to conceive when I'm not relying on static data, thus it'll get
  // focused on later. Maybe a periodic check via api, once a minute? seems expensive
  useEffect(() => {
    if (timeSinceLastMessage <= 5 && timeSinceLastMessage > 0) {
      setTimeStamp(`${timeSinceLastMessage} minutes ago`);
    } else if (timeSinceLastMessage > 5) {
      setTimeStamp(formattedTimestamp);
    } else {
      setTimeStamp("sent just now");
    }
  }, [timestamp]);

  return (
    <div>
      <p>{timeStamp}</p>
    </div>
  );
};

export default MessageTimeStamp;

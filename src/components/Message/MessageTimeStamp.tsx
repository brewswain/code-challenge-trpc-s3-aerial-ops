import { useEffect, useState } from "react";

interface MessageTimeStampProps {
  createdAt: Date;
}

const MessageTimeStamp = ({ createdAt }: MessageTimeStampProps) => {
  const [timeStamp, setTimeStamp] = useState<string>("");

  const calculateTimestamps = () => {
    const previousMessageTimeInMinutes = Math.floor(
      createdAt.getTime() / (1000 * 60)
    );
    const currentTimeinMinutes = Math.floor(Date.now() / (1000 * 60));
    const timeSinceLastMessage =
      currentTimeinMinutes - previousMessageTimeInMinutes;

    if (timeSinceLastMessage <= 5 && timeSinceLastMessage > 0) {
      setTimeStamp(`${timeSinceLastMessage} minutes ago`);
      ``;
    } else if (timeSinceLastMessage > 5) {
      setTimeStamp(formattedTimestamp);
    } else {
      setTimeStamp("sent just now");
    }
  };
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

  useEffect(() => {
    // Ensures we instantly load up timestamps then checks every minute
    setInterval(() => {
      calculateTimestamps();
    }, 60000);
  }, [timestamp]);

  // TODO:  instead of using two separate useEffects to run the same method, incorporate the conditional setInterval into our calculateTimestamps() method itself.
  // The only reason why i have them separated is to ensure that the timestamp gets rendered on message being rendered.
  useEffect(() => {
    calculateTimestamps();
  }, []);

  return (
    <div>
      <p className="text-xs text-slate-400">{timeStamp}</p>
    </div>
  );
};

export default MessageTimeStamp;

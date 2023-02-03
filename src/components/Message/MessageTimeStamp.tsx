import { useEffect, useState } from "react";
import moment from "moment";

interface MessageTimeStampProps {
  createdAt: Date | null;
}

const MessageTimeStamp = ({ createdAt }: MessageTimeStampProps) => {
  const [timeStamp, setTimeStamp] = useState<string>("");
  // cloning our Date to prevent accidental modification of source

  const calculateTimestamps = () => {
    const createdAtWrapper = moment(createdAt);
    const messageTimeInMinutes = createdAtWrapper.minute();
    const formattedTimestamp = createdAtWrapper.format(
      "ddd, MMM Do YYYY - h:mm A"
    );
    const currentTimeInMinutes = moment().minute();
    const timeSinceLastMessage = currentTimeInMinutes - messageTimeInMinutes;

    switch (true) {
      case timeSinceLastMessage === 0:
        setTimeStamp("Sent just now");
        break;
      case timeSinceLastMessage === 1:
        setTimeStamp("1 minute ago");
        break;
      case timeSinceLastMessage > 1 && timeSinceLastMessage <= 5:
        setTimeStamp(`${timeSinceLastMessage} minutes ago`);
        break;
      default:
        setTimeStamp(formattedTimestamp);
    }
  };

  useEffect(() => {
    // Ensures we instantly load up timestamps then checks every minute
    setInterval(() => {
      calculateTimestamps();
    }, 60000);
  }, [timeStamp]);

  // TODO:  instead of using two separate useEffects to run the same method, incorporate the conditional setInterval into our calculateTimestamps() method itself.
  // The only reason why i have them separated is to ensure that the timestamp gets rendered on message being rendered.
  useEffect(() => {
    calculateTimestamps();
  }, []);

  return (
    <div>
      <p className={`text-xs text-slate-400`}>
        {timeStamp ? timeStamp : "Sent just now"}
      </p>
    </div>
  );
};

export default MessageTimeStamp;

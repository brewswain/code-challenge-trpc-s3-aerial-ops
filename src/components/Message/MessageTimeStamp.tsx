import { MessageProps } from "../../data/testData";

interface MessageTimeStampProps {
  createdAt: Date;
}

const MessageTimeStamp = ({ createdAt }: MessageTimeStampProps) => {
  const timestamp = new Intl.DateTimeFormat([], {
    hour: "numeric",
    minute: "numeric",
    year: "numeric",
  }).format(createdAt);

  return (
    <div>
      <p>{timestamp}</p>
    </div>
  );
};

export default MessageTimeStamp;

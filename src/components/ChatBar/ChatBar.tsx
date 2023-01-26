import { useState, useEffect, useRef } from "react";

import UploadImageButton from "./UploadImageButton";

const ChatBar = () => {
  const [textInput, setTextInput] = useState<string>("");

  const handleChange = (inputMessage: string) => {
    setTextInput(inputMessage);
  };

  const handleSubmit = () => {
    alert("Message sent");
  };

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  // Solution taken from Youtube
  const resizeInput = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "";
      textAreaRef.current.style.height =
        // textAreaRef.current.scrollHeight + "px";
        `${textAreaRef.current.scrollHeight}px`;
    }

    console.log(textAreaRef.current?.scrollHeight);
  };

  const sendMessage = () => {
    setTextInput("");
  };
  // prevent hitting Enter by itself from expanding textarea aka make it send like we expect it to
  const onKeyDown = (event) => {
    if (event.key === "Enter" && !event.altkey && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }

    if (event.key === "Enter" && event.altKey) {
      event.preventDefault();
      setTextInput(textInput + "\r\n");
    }
  };

  useEffect(() => {
    resizeInput();
  }, [textInput]);

  return (
    <div>
      {/* TextArea chosen to allow inherent multi-line support */}
      <textarea
        name="message"
        placeholder="Enter Message..."
        onChange={(event) => handleChange(event.target.value)}
        className="min-h-14 border-1-slate-500 flex h-10 max-h-40 overflow-auto border-2 py-2 px-3 outline-none"
        ref={textAreaRef}
        onKeyDown={onKeyDown}
        value={textInput}
      />
      <UploadImageButton />
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
};

export default ChatBar;

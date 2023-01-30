import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import UploadImageButton from "./UploadImageButton";

import { api } from "../../utils/api";

const ChatBar = () => {
  const [textInput, setTextInput] = useState<string>("");
  const [file, setFile] = useState<File>();

  const utils = api.useContext();

  const sendMessageMutation = api.msg.add.useMutation({
    onMutate: async () => {
      await utils.msg.list.cancel();
    },

    onSuccess: async (signedUrl) => {
      setFile(undefined);
      setTextInput("");
      try {
        await axios({
          method: "put",
          url: signedUrl,
          data: file,
          headers: {
            "Content-Type": file?.type,
          },
        });
      } catch (error) {
        console.error(error);
      }
    },

    onError: (error) => {
      console.error(error);
    },
    onSettled: async () => {
      await utils.msg.invalidate();
    },
  });

  const handleChange = (inputMessage: string) => {
    setTextInput(inputMessage);
  };

  const handleSubmit = () => {
    alert("Message sent");
  };

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Solution taken from youtube--if this breaks check out React's ref documentation:
  // https://reactjs.org/docs/refs-and-the-dom.html
  const resizeInput = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  const sendMessage = () => {
    if (file) {
      sendMessageMutation.mutate({
        messageText: textInput,
        hasImage: true,
        attachment: { name: file.name },
      });
    }
    if (!file && textInput) {
      sendMessageMutation.mutate({
        messageText: textInput,
        hasImage: false,
      });
    }

    setTextInput("");
  };

  // prevent hitting Enter by itself from expanding textarea aka make message send like we expect it to
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.altKey && !event.shiftKey) {
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
      <UploadImageButton setFile={setFile} />
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
};

export default ChatBar;

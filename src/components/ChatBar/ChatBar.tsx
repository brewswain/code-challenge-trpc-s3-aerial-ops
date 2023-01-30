import React, { useState, useEffect, useRef } from "react";
import { string } from "zod";
import axios from "axios";

import UploadImageButton from "./UploadImageButton";

import { api } from "../../utils/api";
import { UseQueryOptions } from "@tanstack/react-query";

const ChatBar = () => {
  const [textInput, setTextInput] = useState<string>("");
  const [files, setFiles] = useState<File[]>();
  const [signedUrl, setSignedUrl] = useState({ url: string, key: string });

  const utils = api.useContext();
  const imageIsAttached = files && files?.length > 0;

  console.log({ files });

  const getPresignedUrlQuery = api.msg.generatePresignedUrl.useQuery({
    file: imageIsAttached ? files[0]?.name : undefined,
  });

  const sendMessageMutation = api.msg.add.useMutation({
    onMutate: async () => {
      await utils.msg.list.cancel();
    },

    onError: (error) => {
      console.error(error);
    },
    onSettled: async () => {
      await utils.msg.invalidate();
    },
  });

  if (imageIsAttached) {
    console.log(getPresignedUrlQuery.data);
  }

  // const name = file.name as string;
  // const getPresignedUrlQuery = api.msg.generatePresignedUrl.useQuery({
  //   file: name,
  // });

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
    if (textInput) {
      sendMessageMutation.mutate({
        messageText: textInput,
        hasImage: imageIsAttached ? true : false,
        signedUrl: imageIsAttached ? getPresignedUrlQuery.data : undefined,
        // file: imageIsAttached ? files[0] : null,
      });
    }

    setTextInput("");
  };

  const getS3ImageUrl = async (file: File[]) => {
    if (files && files.length > 0) {
      const file = files[0];
      console.log({ file });
      try {
        await axios.put(getPresignedUrlQuery.data.url, file);
        console.log({ signedUrl: signedUrl.data });
      } catch (error) {
        console.error(error);
      }
    }

    // return getPresignedUrlQuery.data.key;
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

  useEffect(() => {
    imageIsAttached && getS3ImageUrl(files);
  }, [files]);

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
      <UploadImageButton setFiles={setFiles} />
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
};

export default ChatBar;

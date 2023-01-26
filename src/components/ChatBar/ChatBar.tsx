import UploadImageButton from "./UploadImageButton";

const ChatBar = () => {
  const handleSubmit = () => {
    alert("Message sent");
  };

  return (
    <div>
      <input type="text" placeholder="Enter Message..." />
      <UploadImageButton />
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
};

export default ChatBar;

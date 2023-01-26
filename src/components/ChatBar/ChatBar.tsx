const ChatBar = () => {
  const handleImageUpload = () => {
    alert("Image uploaded");
  };

  const handleSubmit = () => {
    alert("Message sent");
  };

  return (
    <div>
      <input type="text" placeholder="Enter Message..." />
      <button onClick={handleImageUpload}>image upload placeholder</button>
      <button onClick={handleSubmit}>Send</button>
    </div>
  );
};

export default ChatBar;

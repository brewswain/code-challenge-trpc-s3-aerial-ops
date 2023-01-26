const UploadImageButton = () => {
  const handleImageUpload = () => {
    alert("Image uploaded");
  };

  return <button onClick={handleImageUpload}>image upload placeholder</button>;
};

export default UploadImageButton;

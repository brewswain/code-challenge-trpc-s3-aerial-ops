import type { ChangeEvent } from "react";

interface UploadImageButtonProps {
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
}

const UploadImageButton = ({ setFile }: UploadImageButtonProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      const files = Array.from(event.target.files);

      files && files.length > 0 && setFile(files[0]);
    }

    return;
  };

  return (
    <>
      <form>
        <input
          type="file"
          accept="image/jpg image/png"
          name="file"
          onChange={handleChange}
        />
        <button type="submit">Upload</button>
      </form>
    </>
  );
};

export default UploadImageButton;

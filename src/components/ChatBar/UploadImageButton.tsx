import type { ChangeEvent } from "react";
import { useRef, useState } from "react";

import { ImAttachment } from "react-icons/im";

interface UploadImageButtonProps {
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  file: File | undefined;
}

const UploadImageButton = ({ file, setFile }: UploadImageButtonProps) => {
  const [fileSelected, setFileSelected] = useState<boolean>(false);
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (hiddenFileInput.current) {
      return hiddenFileInput.current.click();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    console.log(fileSelected);
    if (event.target.files) {
      event.preventDefault();
      const files = Array.from(event.target.files);
      setFileSelected(true);
      files && files.length > 0 && setFile(files[0]);
    }

    return;
  };

  return (
    <>
      <form>
        <button
          onClick={handleClick}
          className={`ml-2 flex h-12  w-12  items-center justify-center border-2  align-middle
          ${file ? "bg-[hsl(0,77%,45%)]" : "bg-white"}
          `}
        >
          <div className="items-center justify-center align-middle">
            <ImAttachment />
          </div>
        </button>
        <input
          type="file"
          className="hidden"
          accept="image/jpg image/png"
          name="file"
          ref={hiddenFileInput}
          onChange={handleChange}
        />
      </form>
    </>
  );
};

export default UploadImageButton;

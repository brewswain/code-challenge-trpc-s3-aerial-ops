import axios from "axios";
import { selectFields } from "express-validator/src/select-fields";

import {
  ChangeEvent,
  useState,
  useEffect,
  createRef,
  SetStateAction,
} from "react";

import { api } from "../../utils/api";

interface UploadImageButtonProps {
  setFiles: React.Dispatch<React.SetStateAction<File[] | undefined>>;
}

const UploadImageButton = ({ setFiles }: UploadImageButtonProps) => {
  const [fileName, setFileName] = useState<string>();

  const response = api.msg.generatePresignedUrl.useQuery({
    file: fileName ? fileName : "",
  });

  const uploadToS3 = async (
    event: ChangeEvent<HTMLFormElement>,
    file: FormDataEntryValue
  ) => {
    event.preventDefault();

    // console.log({ extension });
    // console.log({
    //   file,
    //   url: response.data?.url,
    //   key: response.data?.key,
    //   extension: extension.split(".")[1],
    // });

    // response.data && (await axios.put(response.data.url, file));

    // return response.data?.key;
  };

  // Commented block
  // const handleSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const formData = new FormData(event.target);
  //   const file = formData.get("file");

  //   const extension = file.name;
  //   setFileName(extension);
  //   const key = await uploadToS3(event, file);
  // };

  const fileInput = createRef();

  // const handleChange = (event: ChangeEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   // console.log(event.target.files);
  //   const formData = new FormData(event.target);
  //   const file = formData.get("file");

  //   const extension = file.name;
  //   console.log({ extension });
  //   // setFileName(extension);
  //   // const key = await uploadToS3(event, file);

  //   // set
  // };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      console.log({ files });

      setFiles(files);
    }
    return;
  };

  // event.target.files &&
  //   event.target.files.length &&
  //   setFile(event.target.files[0]);
  // console.log({ formData });
  // const formData = new FormData(event.target);
  // const file = formData.get("file");

  // if (file) {
  //   const extension = file.name;
  //   setFileExtension(extension);
  //   // const key = await uploadToS3(event, file);
  // }

  return (
    <>
      <form>
        <input
          type="file"
          accept="image/jpg image/png"
          name="file"
          // onChange: ChangeEventHandler<HTMLFormElement></HTMLFormElement>={(event: ChangeEvent<HTMLFormElement>) => {
          //   const formData = new FormData(event.target);
          //   const file = formData.get("file");
          //   file && setFileName(file);
          onChange={
            handleChange

            // const extension = file ? file.name : null;
          }
        />
        <button type="submit">Upload</button>
      </form>
    </>
  );
};

export default UploadImageButton;

import Image from "next/image";

interface ImageBoxProps {
  imageUrl: string;
}

const ImageBox = ({ imageUrl }: ImageBoxProps) => {
  return (
    <>
      <div className="">
        <img src={imageUrl} alt="hi" className="max-h-[500px]" />
      </div>
    </>
  );
};

export default ImageBox;

import Image from "next/image";

interface ImageBoxProps {
  imageUrl: string;
}

const ImageBox = ({ imageUrl }: ImageBoxProps) => {
  return (
    <>
      {/* <Image
        src={imageUrl}
        alt="placeholder image of kittens"
        // fill
        width={200}
        height={200}
      /> */}

      <img src={imageUrl} alt="hi" />
    </>
  );
};

export default ImageBox;

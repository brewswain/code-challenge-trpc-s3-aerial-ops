import Image from "next/image";

const ImageBox = ({ imageUrl }: string) => {
  return (
    <>
      <Image
        src={imageUrl}
        alt="placeholder image of kittens"
        // fill
        width={200}
        height={200}
      />
    </>
  );
};

export default ImageBox;

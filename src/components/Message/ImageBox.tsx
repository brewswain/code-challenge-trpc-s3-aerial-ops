import Image from "next/image";

const ImageBox = () => {
  return (
    <>
      <Image
        src="https://placekitten.com/300/300"
        alt="placeholder image of kittens"
        // fill
        width={300}
        height={300}
      />
    </>
  );
};

export default ImageBox;

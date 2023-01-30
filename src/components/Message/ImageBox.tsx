/* eslint-disable @next/next/no-img-element */
// Chosen to not use Next's native Image element here.
// TODO: replace when I'm done with stretch goals

interface ImageBoxProps {
  imageUrl: string;
}

const ImageBox = ({ imageUrl }: ImageBoxProps) => {
  return (
    <>
      <div className="">
        <img src={imageUrl} alt="hi" className="max-h-[350px]" />
      </div>
    </>
  );
};

export default ImageBox;

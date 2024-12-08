import Image from "next/image";

interface CardImageProps {
  src: string;
  alt: string;
  isGridLayout: boolean;
}

function CardImage({ src, alt, isGridLayout }: CardImageProps) {
  return (
    <div
      className={`relative ${
        isGridLayout ? "h-48 w-full" : "w-40 flex-shrink-0"
      }`}
    >
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
}

export default CardImage;

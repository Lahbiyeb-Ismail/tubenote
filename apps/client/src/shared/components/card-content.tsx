import Link from "next/link";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui";

interface CardContentProps {
  cardTitle: string;
  href: string;
  cardDescription?: string;
  isGridLayout: boolean;
}

export function CardContent({
  cardTitle,
  cardDescription,
  href,
  isGridLayout,
}: CardContentProps) {
  return (
    <CardHeader
      className={`${isGridLayout ? "space-y-2" : "space-y-0"} px-6 py-0`}
    >
      <CardTitle
        className={`font-bold hover:underline transition-all ${
          isGridLayout ? "text-xl line-clamp-2" : "text-lg line-clamp-1"
        }`}
      >
        <Link href={href}>{cardTitle}</Link>
      </CardTitle>
      <CardDescription className="text-sm text-muted-foreground line-clamp-1">
        {cardDescription}
      </CardDescription>
    </CardHeader>
  );
}

export default CardContent;

import { CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface CardContentProps {
	cardTitle: string;
	cardDescription: string;
	noteId: string;
	isGridLayout: boolean;
}

function CardContent({
	cardTitle,
	cardDescription,
	noteId,
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
				<Link href={`/notes/${noteId}`}>{cardTitle}</Link>
			</CardTitle>
			<CardDescription className="text-sm text-muted-foreground line-clamp-1">
				{cardDescription}
			</CardDescription>
		</CardHeader>
	);
}

export default CardContent;

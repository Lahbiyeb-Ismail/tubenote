import Link from "next/link";
import { PencilIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useLayout } from "@/context/useLayout";

type EditNoteButtonProps = {
	noteId: string;
	isLoading: boolean;
};

function EditNoteButton({ noteId, isLoading }: EditNoteButtonProps) {
	const { isGridLayout } = useLayout();

	return (
		<Link href={`/editor/update/${noteId}`}>
			<Button
				variant="outline"
				size={!isGridLayout ? "icon" : "sm"}
				className={`text-blue-600 hover:text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed ${
					!isGridLayout ? "w-10 h-10 p-0" : ""
				}`}
				disabled={isLoading}
			>
				<PencilIcon className={`h-4 w-4 ${!isGridLayout ? "m-0" : "mr-2"}`} />
				{isGridLayout && "Edit"}
			</Button>
		</Link>
	);
}

export default EditNoteButton;

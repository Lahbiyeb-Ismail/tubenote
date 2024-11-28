import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface NoteErrorProps {
	onRetry: () => void;
}

function NoteError({ onRetry }: NoteErrorProps) {
	return (
		<Alert variant="destructive">
			<AlertCircle className="h-4 w-4" />
			<AlertTitle>Error</AlertTitle>
			<AlertDescription className="flex items-center gap-4">
				Failed to load note.
				<Button variant="outline" size="sm" onClick={onRetry}>
					Try again
				</Button>
			</AlertDescription>
		</Alert>
	);
}

export default NoteError;

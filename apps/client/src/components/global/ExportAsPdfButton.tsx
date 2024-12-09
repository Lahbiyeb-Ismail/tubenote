import { Printer } from "lucide-react";
import { Button } from "../ui/button";

type ExportAsPdfButtonProps = {
	onExport: () => void;
};

function ExportAsPdfButton({ onExport }: ExportAsPdfButtonProps) {
	return (
		<Button
			variant="outline"
			size="sm"
			className="bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-gray-500 transition-all duration-300 shadow-sm hover:shadow"
			onClick={onExport}
		>
			<Printer className="h-4 w-4 mr-2" />
			<span>Export as PDF</span>
		</Button>
	);
}

export default ExportAsPdfButton;

import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "../ui/button";

function HomeButton() {
	return (
		<Link href="/">
			<Button
				variant="outline"
				size="icon"
				className="fixed top-4 left-4 z-50 rounded-full shadow-md bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out size-12"
				aria-label="Go to home page"
			>
				<Home className="size-8 text-primary" />
			</Button>
		</Link>
	);
}

export default HomeButton;

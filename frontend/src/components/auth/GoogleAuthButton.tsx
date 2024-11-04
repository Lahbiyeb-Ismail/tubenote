import Image from "next/image";
import { Button } from "../ui/button";

function GoogleAuthButton() {
	return (
		<Button variant="outline" className="w-full">
			<Image
				className="mr-2 h-4 w-4"
				src="/images/google.png"
				alt="google icon"
				width={512}
				height={512}
			/>
			Sign in with Google
		</Button>
	);
}

export default GoogleAuthButton;

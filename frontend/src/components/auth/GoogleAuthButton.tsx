import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import getGoogleOAuthUrl from "@/helpers/getGoogleUrl";

function GoogleAuthButton() {
	return (
		<Link href={getGoogleOAuthUrl()}>
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
		</Link>
	);
}

export default GoogleAuthButton;

import { GOOGLE_REDIRECT_URI } from "@/utils/constants";
import Image from "next/image";
import { Button } from "../ui/button";

function GoogleAuthButton() {
  const handleGoogleAuth = () => {
    window.location.href = `${GOOGLE_REDIRECT_URI}`;
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleGoogleAuth}>
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

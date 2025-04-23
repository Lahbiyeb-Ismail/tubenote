import { AlertTriangle, CheckCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../contexts";

type EmailConfirmationAlertProps = {
  emailVerified: boolean;
  email: string;
};

export function EmailConfirmationAlert({
  emailVerified,
  email,
}: EmailConfirmationAlertProps) {
  const { sendVerificationEmailMutationResult } = useAuth();

  const { mutate: sendVerificationEmail, isPending } =
    sendVerificationEmailMutationResult;

  if (emailVerified) {
    return (
      <Alert className="mb-6 bg-green-100 border-green-500">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertTitle>Email Verified</AlertTitle>
        <AlertDescription>
          Your email address has been successfully verified.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-6 bg-yellow-100 border-yellow-500">
      <AlertTriangle className="h-4 w-4 text-yellow-500" />
      <AlertTitle>Email Not Verified</AlertTitle>
      <AlertDescription>
        Please verify your email address.{" "}
        <Button
          variant="link"
          className="p-0 h-auto font-normal text-yellow-700 hover:text-yellow-900"
          onClick={() => sendVerificationEmail(email)}
          disabled={isPending}
        >
          {isPending
            ? "Sending..."
            : "Click here to send a verification email."}
        </Button>
      </AlertDescription>
    </Alert>
  );
}

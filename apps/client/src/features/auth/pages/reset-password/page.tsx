"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  AuthPageLayout,
  PasswordResetErrorState,
  PasswordResetLoadingState,
} from "@/features/auth/components";
import { useVerifyPasswordResetTokenQuery } from "@/features/auth/queries";

import { ResetPasswordForm } from "./components";

export function ResetPasswordPage() {
  const { token } = useParams();

  const { isError, isLoading } = useVerifyPasswordResetTokenQuery(token as string);

  if (isLoading)
    return <PasswordResetLoadingState />;

  if (isError)
    return <PasswordResetErrorState />;

  return (
    <AuthPageLayout
      title="Reset Your Password"
      description="Enter your new password"
      showSocialLoginOptions={false}
      pageContent={<ResetPasswordForm token={token as string} />}
      pageFooter={(
        <p className="text-sm text-gray-600">
          Remember your password?
          {" "}
          <Link href="/login" className="text-red-600 hover:underline">
            Sign In
          </Link>
        </p>
      )}
    />
  );
}

"use client";

import Link from "next/link";

import { AuthPageLayout, ForgotPasswordForm } from "../components";

export function ForgotPasswordPage() {
  return (
    <AuthPageLayout
      title="Reset Your Password"
      description="Enter your email to reset your password"
      showGoogleAuth={false}
      pageContent={<ForgotPasswordForm />}
      pageFooter={
        <p className="text-sm text-gray-600">
          Remember your password?{" "}
          <Link href="/login" className="text-red-600 hover:underline">
            Log in here
          </Link>
        </p>
      }
    />
  );
}

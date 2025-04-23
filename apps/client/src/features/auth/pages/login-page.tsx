"use client";

import Link from "next/link";

import { AuthPageLayout, LoginForm } from "../components";

export function LoginPage() {
  return (
    <AuthPageLayout
      title="Welcome Back"
      description="Login to your account to access your notes"
      pageContent={<LoginForm />}
      pageFooter={
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-red-600 hover:underline">
            Register here
          </Link>
        </p>
      }
    />
  );
}

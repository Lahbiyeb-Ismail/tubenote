"use client";

import Link from "next/link";

import { AuthPageLayout } from "../../components";
import { LoginForm } from "./components";

export function LoginPage() {
  return (
    <AuthPageLayout
      title="Welcome Back"
      description="Sign in to continue your video note journey"
      pageContent={<LoginForm />}
      pageFooter={(
        <p className="text-sm text-gray-600">
          Don't have an account?
          {" "}
          <Link href="/register" className="text-red-600 hover:underline">
            Sign Up
          </Link>
        </p>
      )}
    />
  );
}

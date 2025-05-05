"use client";

import Link from "next/link";

import { AuthPageLayout, RegisterForm } from "../components";

export function RegisterPage() {
  return (
    <AuthPageLayout
      title="Join TubeNote Today"
      description="Unlock the full potential of video learning with our powerful tools"
      pageContent={<RegisterForm />}
      pageFooter={
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-red-600 hover:underline">
            Login here
          </Link>
        </p>
      }
    />
  );
}

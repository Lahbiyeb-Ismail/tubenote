"use client";

import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

import { useOauthTokenExchangeMutation } from "@/features/auth/queries";

interface IPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default function AuthCallback({ searchParams }: IPageProps) {
  const router = useRouter();
  const { code } = use(searchParams);
  const { mutate, isPending, isSuccess, isError, error } = useOauthTokenExchangeMutation();

  useEffect(() => {
    if (code) {
      mutate(code);
    }
    else {
      router.push("/"); // Or an error page
    }
  }, [code, mutate, router]);

  useEffect(() => {
    if (isSuccess) {
      router.push("/dashboard");
    }
    if (isError) {
      router.push("/"); // Or a login-failed page
    }
  }, [isSuccess, isError, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        {isPending && "Processing authentication..."}
        {isError && `Authentication failed: ${error.message}`}
        {isSuccess && "Authentication successful. Redirecting..."}
      </div>
    </div>
  );
}

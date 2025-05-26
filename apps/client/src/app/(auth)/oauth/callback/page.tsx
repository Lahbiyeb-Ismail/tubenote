"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useRef } from "react";

import { useExchangeOauthCode } from "@/features/auth/hooks";

interface IPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default function AuthCallback({ searchParams }: IPageProps) {
  const router = useRouter();
  const { code } = use(searchParams);

  const {
    isPending,
    isSuccess,
    isError,
    mutate: exchangeOauthCode,
  } = useExchangeOauthCode();

  const exchangeAttempted = useRef(false);

  useEffect(() => {
    function exchangeOauthCodeWithAccessToken() {
      if (exchangeAttempted.current) return;

      exchangeAttempted.current = true;

      if (!code) {
        setTimeout(() => router.push("/"), 2000);
        return;
      }

      exchangeOauthCode(code);

      if (isError) {
        setTimeout(() => router.push("/"), 2000);
        return;
      }
    }

    exchangeOauthCodeWithAccessToken();
  }, [code, router, exchangeOauthCode, isError]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        {isPending && "Processing authentication..."}
        {isError && "Authentication failed. Please try again."}
        {isSuccess && "Authentication successful. Redirecting..."}
      </div>
    </div>
  );
}

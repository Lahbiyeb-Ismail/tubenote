"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useRef } from "react";

import { useAuth } from "@/features/auth/hooks";

interface IPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default function AuthCallback({ searchParams }: IPageProps) {
  const router = useRouter();
  const { code } = use(searchParams);

  const {
    oauthExchangeToken,
    isOauthExchangeTokenLoading,
    oauthExchangeTokenError,
  } = useAuth();

  const exchangeAttempted = useRef(false);

  useEffect(() => {
    function exchangeOauthCodeWithAccessToken() {
      if (exchangeAttempted.current)
        return;

      exchangeAttempted.current = true;

      if (!code) {
        setTimeout(() => router.push("/"), 2000);
        return;
      }

      oauthExchangeToken(code);

      if (oauthExchangeTokenError) {
        setTimeout(() => router.push("/"), 2000);
      }
    }

    exchangeOauthCodeWithAccessToken();
  }, [code, router, oauthExchangeToken, oauthExchangeTokenError]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        {isOauthExchangeTokenLoading && "Processing authentication..."}
        {oauthExchangeTokenError && "Authentication failed. Please try again."}
        {!oauthExchangeTokenError && "Authentication successful. Redirecting..."}
      </div>
    </div>
  );
}

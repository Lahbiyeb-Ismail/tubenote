"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { useAuth } from "@/features/auth/contexts";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { exchangeOauthCodeMutationResult } = useAuth();

  const {
    isPending,
    isSuccess,
    isError,
    mutate: exchangeOauthCode,
  } = exchangeOauthCodeMutationResult;

  // const [status, setStatus] = useState<"loading" | "success" | "error">(
  //   "loading"
  // );
  const exchangeAttempted = useRef(false);

  useEffect(() => {
    function exchangeOauthCodeWithAccessToken() {
      if (exchangeAttempted.current) return;

      exchangeAttempted.current = true;

      const code = searchParams.get("code");

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
  }, [searchParams, router, exchangeOauthCode, isError]);

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

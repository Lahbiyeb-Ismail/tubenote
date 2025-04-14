"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { exchangeOauthCodeForAuthTokens } from "@/actions/auth.actions";
import { setStorageValue } from "@/utils/localStorage";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const exchangeAttempted = useRef(false);

  useEffect(() => {
    async function exchangeOauthCodeWithAccessToken() {
      if (exchangeAttempted.current) return;

      exchangeAttempted.current = true;

      const code = searchParams.get("code");

      if (!code) {
        setStatus("error");
        setTimeout(() => router.push("/"), 2000);
        return;
      }

      try {
        const { payload } = await exchangeOauthCodeForAuthTokens(code);

        setStorageValue("accessToken", payload.data);

        setStatus("success");
        router.push("/dashboard");
      } catch (error) {
        console.error("Authentication error:", error);

        setStatus("error");
        setTimeout(() => router.push("/"), 2000);
      }
    }

    exchangeOauthCodeWithAccessToken();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        {status === "loading" && "Processing authentication..."}
        {status === "error" && "Authentication failed. Please try again."}
        {status === "success" && "Authentication successful. Redirecting..."}
      </div>
    </div>
  );
}

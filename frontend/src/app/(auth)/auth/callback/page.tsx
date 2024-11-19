"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useGetCurrentUser from "@/hooks/user/useGetCurrentUser";

function AuthCallbackContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { refetch: refetchCurrentUser } = useGetCurrentUser();
	const [status, setStatus] = useState<"loading" | "success" | "error">(
		"loading",
	);

	useEffect(() => {
		async function handleAccessToken() {
			const accessToken = searchParams.get("access_token") as string;
			const parsedAccessToken = JSON.parse(decodeURIComponent(accessToken));

			if (!parsedAccessToken) {
				setStatus("error");
				setTimeout(() => router.push("/"), 2000);
				return;
			}

			try {
				localStorage.setItem("accessToken", parsedAccessToken);

				await refetchCurrentUser();
				setStatus("success");
				router.push("/");
			} catch (error) {
				console.error("Authentication error:", error);
				setStatus("error");
				setTimeout(() => router.push("/"), 2000);
			}
		}

		handleAccessToken();
	}, [searchParams, router, refetchCurrentUser]);

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

export default function AuthCallback() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<AuthCallbackContent />
		</Suspense>
	);
}

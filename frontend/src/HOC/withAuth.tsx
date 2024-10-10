"use client";

import type { ComponentType } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/useAuth";

function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
	return function WithAuth(props: P) {
		const { state } = useAuth();
		const router = useRouter();

		let accessToken: string | null = null;

		if (typeof window !== "undefined") {
			// This code will only run in the browser
			accessToken = localStorage.getItem("accessToken");
		}

		if (!accessToken) {
			router.push("/login");
			return null; // Render nothing while redirecting
		}

		// If authenticated, render the wrapped component
		return <WrappedComponent {...props} />;
	};
}

export default withAuth;

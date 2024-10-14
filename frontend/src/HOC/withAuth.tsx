"use client";

import type { ComponentType } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/useAuth";

function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
	return function WithAuth(props: P) {
		const {
			state: { accessToken },
		} = useAuth();
		const router = useRouter();

		if (!accessToken) {
			router.push("/login");
			return null; // Render nothing while redirecting
		}

		// If authenticated, render the wrapped component
		return <WrappedComponent {...props} />;
	};
}

export default withAuth;

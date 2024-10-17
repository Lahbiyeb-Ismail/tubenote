"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/useAuth";

function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
	return function WithAuth(props: P) {
		const [isAuthenticated, setIsAuthenticated] = useState(false);
		const {
			state: { accessToken },
		} = useAuth();
		const router = useRouter();

		useEffect(() => {
			if (!accessToken) {
				router.push("/login");
			} else {
				setIsAuthenticated(true);
			}
		}, [accessToken, router]);

		if (!isAuthenticated) {
			return null; // Render nothing while checking authentication
		}

		// If authenticated, render the wrapped component
		return <WrappedComponent {...props} />;
	};
}

export default withAuth;

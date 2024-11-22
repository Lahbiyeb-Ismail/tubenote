"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
	return function WithAuth(props: P) {
		const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
			null,
		);
		const router = useRouter();

		useEffect(() => {
			let isMounted = true;

			const checkAuth = () => {
				try {
					const accessToken = localStorage.getItem("accessToken");
					if (!accessToken) {
						router.push("/login");
					} else if (isMounted) {
						setIsAuthenticated(true);
					}
				} catch (error) {
					console.error("Error checking authentication:", error);
					router.push("/login");
				}
			};

			checkAuth();

			return () => {
				isMounted = false;
			};
		}, [router]);

		if (isAuthenticated === null) {
			return null; // or a loading spinner
		}

		return <WrappedComponent {...props} />;
	};
}

export default withAuth;

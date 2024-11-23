"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useGetCurrentUser from "@/hooks/user/useGetCurrentUser";

function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
	return function WithAuth(props: P) {
		const { data: user, isLoading, isError } = useGetCurrentUser();
		const router = useRouter();

		useEffect(() => {
			if (!isLoading && !user) {
				router.push("/login");
			}
		}, [user, isLoading, router]);

		if (isError) {
			// Handle error state, maybe show an error message or redirect
			router.push("/error");
			return null;
		}

		if (!user) {
			return null; // This will be briefly shown before redirecting
		}

		return <WrappedComponent {...props} />;
	};
}

export default withAuth;

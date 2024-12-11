"use client";

import useGetCurrentUser from "@/hooks/user/useGetCurrentUser";
import { removeStorageValue } from "@/utils/localStorage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function WithAuth(props: P) {
    const { data: user, isLoading, isError } = useGetCurrentUser();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !user) {
        removeStorageValue("accessToken");
        router.push("/login");
      }
    }, [user, isLoading, router]);

    if (isError) {
      // Handle error state, maybe show an error message or redirect
      removeStorageValue("accessToken");
      router.push("/login");
      return null;
    }

    if (!user) {
      return null; // This will be briefly shown before redirecting
    }

    return <WrappedComponent {...props} />;
  };
}

export default withAuth;

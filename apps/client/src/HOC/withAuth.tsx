"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useGetCurrentUser } from "@/features/user/hooks";
import { removeStorageValue } from "@/utils/localStorage";

function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function WithAuth(props: P) {
    const { data: response, isLoading, isError } = useGetCurrentUser();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !response?.success) {
        removeStorageValue("accessToken");
        router.push("/login");
      }
    }, [response, isLoading, router]);

    if (isError) {
      // Handle error state, maybe show an error message or redirect
      removeStorageValue("accessToken");
      router.push("/login");
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

export default withAuth;

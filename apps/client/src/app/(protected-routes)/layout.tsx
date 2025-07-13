"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useGetCurrentUserQuery } from "@/features/user/queries";
import { Loader } from "@/shared/components";

interface IProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: IProps) {
  const router = useRouter();
  const { isPending, isError, isSuccess } = useGetCurrentUserQuery();

  useEffect(() => {
    if (!isPending && isError) {
      router.push("/login");
    }
  }, [isPending, isError, router]);

  if (isPending || isError) {
    return <Loader />; // Or preferably, a layout-specific skeleton
  }

  if (isSuccess) {
    return <>{children}</>;
  }

  return null;
}

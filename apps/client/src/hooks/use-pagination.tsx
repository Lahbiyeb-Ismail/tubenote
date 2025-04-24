"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

import { DEFAULT_PAGE } from "@/utils";

interface UsePaginationProps {
  defaultPage?: number;
}

export function usePagination({
  defaultPage = DEFAULT_PAGE,
}: UsePaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? Number.parseInt(pageParam, 10) : defaultPage;

  const setPage = useCallback(
    (page: number) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", page.toString());
      router.push(`?${newSearchParams.toString()}`);
    },
    [router, searchParams]
  );

  useEffect(() => {
    if (!pageParam) {
      setPage(defaultPage);
    }
  }, [pageParam, defaultPage, setPage]);

  return {
    currentPage,
    setPage,
  };
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

interface UseSortByQueriesProps {
  defaultSortBy?: "createdAt" | "updatedAt";
  defaultOrder?: "asc" | "desc";
}

export function useSortByQueries({
  defaultSortBy = "createdAt",
  defaultOrder = "desc",
}: UseSortByQueriesProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortByQuery = searchParams.get("sortBy");
  const sortBy = sortByQuery ? sortByQuery : defaultSortBy;

  const orderQuery = searchParams.get("order");
  const order = orderQuery ? orderQuery : defaultOrder;

  const setSortByQueries = useCallback(
    (sortBy: string, order: string) => {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("sortBy", sortBy);
      newSearchParams.set("order", order);

      router.push(`?${newSearchParams.toString()}`);
    },
    [router, searchParams]
  );

  useEffect(() => {
    if (!sortByQuery) {
      setSortByQueries(sortBy, order);
    }
  }, [setSortByQueries, sortBy, order, sortByQuery]);

  return {
    sortBy,
    order,
    setSortByQueries,
  };
}

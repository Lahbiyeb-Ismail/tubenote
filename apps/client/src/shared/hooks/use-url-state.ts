"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useUrlState<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchParamValue = searchParams.get(key);

  let value: T;

  if (searchParamValue) {
    if (typeof searchParamValue === "string") {
      value = searchParamValue as T;
    }
    else {
      value = JSON.parse(searchParamValue);
    }
  }
  else {
    value = initialValue;
  }

  const setValue = useCallback(
    (newValue: T) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      if (typeof newValue === "string") {
        newSearchParams.set(key, newValue);
      }
      else {
        newSearchParams.set(key, JSON.stringify(newValue));
      }

      router.push(`${pathname}?${newSearchParams.toString()}`);
    },
    [key, pathname, router, searchParams],
  );

  return [value, setValue];
}

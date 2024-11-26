"luse client";

import { useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_PAGE } from "@/utils/constants";

interface UsePaginationProps {
	defaultPage?: number;
}

function usePagination({ defaultPage = DEFAULT_PAGE }: UsePaginationProps) {
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
		[router, searchParams],
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

export default usePagination;

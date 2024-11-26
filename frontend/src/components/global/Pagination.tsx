"use client";

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export default function PaginationComponent({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationProps) {
	const maxVisiblePages = 5;
	const halfDisplayedPageCount = Math.floor(maxVisiblePages / 2);

	let firstPage = Math.max(currentPage - halfDisplayedPageCount, 1);
	const lastPage = Math.min(firstPage + maxVisiblePages - 1, totalPages);

	if (lastPage - firstPage + 1 < maxVisiblePages) {
		firstPage = Math.max(lastPage - maxVisiblePages + 1, 1);
	}

	const pageNumbers = Array.from(
		{ length: totalPages },
		(_, i) => firstPage + i,
	);

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						href="#"
						onClick={(e) => {
							e.preventDefault();
							if (currentPage > 1) onPageChange(currentPage - 1);
						}}
					/>
				</PaginationItem>

				{firstPage > 1 && (
					<>
						<PaginationItem>
							<PaginationLink
								href="#"
								onClick={(e) => {
									e.preventDefault();
									onPageChange(1);
								}}
							>
								1
							</PaginationLink>
						</PaginationItem>
						{firstPage > 2 && <PaginationEllipsis />}
					</>
				)}

				{pageNumbers.map((pageNumber) => (
					<PaginationItem key={pageNumber}>
						<PaginationLink
							href="#"
							isActive={pageNumber === currentPage}
							onClick={(e) => {
								e.preventDefault();
								onPageChange(pageNumber);
							}}
						>
							{pageNumber}
						</PaginationLink>
					</PaginationItem>
				))}

				{lastPage < totalPages && (
					<>
						{lastPage < totalPages - 1 && <PaginationEllipsis />}
						<PaginationItem>
							<PaginationLink
								href="#"
								onClick={(e) => {
									e.preventDefault();
									onPageChange(totalPages);
								}}
							>
								{totalPages}
							</PaginationLink>
						</PaginationItem>
					</>
				)}

				<PaginationItem>
					<PaginationNext
						href="#"
						onClick={(e) => {
							e.preventDefault();
							if (currentPage < totalPages) onPageChange(currentPage + 1);
						}}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}

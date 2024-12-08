import type { AxiosError } from "axios";

export type TypedError = AxiosError<{ message: string }>;

export type User = {
	id: string;
	username: string;
	email: string;
	profilePicture: string | null;
	emailVerified: boolean;
	createAt: string;
	updatedAt: string;
};

export type Pagination = {
	totalItems: number;
	totalPages: number;
	currentPage: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
};

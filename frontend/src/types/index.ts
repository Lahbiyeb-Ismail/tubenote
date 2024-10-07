import type { AxiosError } from 'axios';

export type TypedError = AxiosError<{ message: string }>;

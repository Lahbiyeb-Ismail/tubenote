import type { searchFormSchema } from "@/schemas";
import { z } from "zod";

export type SearchFormType = z.infer<typeof searchFormSchema>;

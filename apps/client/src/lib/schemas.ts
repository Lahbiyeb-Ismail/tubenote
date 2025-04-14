import { z } from "zod";

export const videoFormSchema = z.object({
  videoUrl: z
    .string()
    .url({
      message: "Invalid youtube URL. Please provide a valid youtube video URL.",
    })
    .includes("youtube.com/watch?v=", {
      message: "Invalid youtube URL. Please provide a valid youtube video URL.",
    }),
});

export const saveNoteFormSchema = z.object({
  noteTitle: z
    .string({
      message: "Note title is required. Please enter a title.",
    })
    .min(3, {
      message: "Note title must be at least 3 characters long.",
    }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

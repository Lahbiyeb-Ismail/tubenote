"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";

import type { IEmailBodyDto } from "@tubenote/dtos";
import { emailBodySchema } from "@tubenote/schemas";

import { Button, Form } from "@/components/ui";

import { useAuth } from "../../contexts";
import { FormInput } from "../inputs";

export function ForgotPasswordForm() {
  const form = useForm<IEmailBodyDto>({
    resolver: zodResolver(emailBodySchema),
    defaultValues: {
      email: "",
    },
  });

  const { sendForgotPasswordEmailMutationResult } = useAuth();
  const { mutate: sendForgotPasswordEmail, isPending } =
    sendForgotPasswordEmailMutationResult;

  const handleForgotPassword = async (formData: IEmailBodyDto) => {
    sendForgotPasswordEmail(formData.email);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleForgotPassword)}
        className="space-y-4"
      >
        <FormInput
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          icon={Mail}
          control={form.control}
        />
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-red-600 to-purple-600 text-white hover:from-red-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isPending}
        >
          {isPending ? "Sending..." : "Reset Password"}
        </Button>
      </form>
    </Form>
  );
}

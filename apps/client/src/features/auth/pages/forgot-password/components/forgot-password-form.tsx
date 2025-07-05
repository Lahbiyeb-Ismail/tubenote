"use client";

import type { IEmailBodyDto } from "@tubenote/dtos";

import { zodResolver } from "@hookform/resolvers/zod";
import { emailBodySchema } from "@tubenote/schemas";
import { Mail } from "lucide-react";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui";
import { AuthSubmitButton } from "@/features/auth/components";
import { useAuth } from "@/features/auth/hooks";
import { FormInput } from "@/shared/components";

export function ForgotPasswordForm() {
  const form = useForm<IEmailBodyDto>({
    resolver: zodResolver(emailBodySchema),
    defaultValues: {
      email: "",
    },
  });

  const { sendForgotPasswordEmail, isSendForgotPasswordEmailLoading }
    = useAuth();

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
          label="Email Address"
          placeholder="Enter your email"
          icon={Mail}
          control={form.control}
        />
        <AuthSubmitButton isLoading={isSendForgotPasswordEmailLoading} buttonLabel="Send Reset Link" loadingLabel="Sending..." />
      </form>
    </Form>
  );
}

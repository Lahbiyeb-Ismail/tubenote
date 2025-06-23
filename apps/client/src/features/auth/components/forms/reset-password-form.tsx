"use client";

import type { IPasswordBodyDto } from "@tubenote/dtos";

import { zodResolver } from "@hookform/resolvers/zod";
import { passwordBodySchema } from "@tubenote/schemas";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";

import { FormInput } from "@/components/global";
import { Form } from "@/components/ui";

import { useAuth } from "../../hooks";
import { AuthSubmitButton } from "../buttons";

export function ResetPasswordForm({ token }: { token: string }) {
  const form = useForm<IPasswordBodyDto>({
    resolver: zodResolver(passwordBodySchema),
    defaultValues: {
      password: "",
      // confirmPassword: "",
    },
  });

  const { resetPassword, isResetPasswordLoading } = useAuth();

  const handleResetPassword = async (formData: IPasswordBodyDto) => {
    resetPassword({ token, password: formData.password });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleResetPassword)}
        className="space-y-4"
      >
        <FormInput
          name="password"
          type="password"
          label="New Password"
          placeholder="Enter your new password"
          icon={Lock}
          control={form.control}
        />
        <AuthSubmitButton isLoading={isResetPasswordLoading} buttonLabel="Reset Password" loadingLabel="Resetting..." />
      </form>
    </Form>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";

import type { IPasswordBodyDto } from "@tubenote/dtos";
import { passwordBodySchema } from "@tubenote/schemas";

import { Button, Form } from "@/components/ui";

import { useAuth } from "../../contexts";
import { FormInput } from "../inputs";

export function ResetPasswordForm({ token }: { token: string }) {
  const form = useForm<IPasswordBodyDto>({
    resolver: zodResolver(passwordBodySchema),
    defaultValues: {
      password: "",
      // confirmPassword: "",
    },
  });

  const { resetPasswordMutationResult } = useAuth();
  const { mutate: resetPassword, isPending } = resetPasswordMutationResult;

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
        {/* <FormInput
              name="confirmPassword"
              type="password"
              label="Confirm New Password"
              placeholder="Confirm your new password"
              icon={Lock}
              control={form.control}
            /> */}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-red-600 to-purple-600 text-white hover:from-red-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isPending}
        >
          {isPending ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </Form>
  );
}

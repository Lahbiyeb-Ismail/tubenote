"use client";

import type { ILoginDto } from "@tubenote/dtos";

import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@tubenote/schemas";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";

import { FormInput } from "@/components/global";
import { Form } from "@/components/ui";
import { AuthSubmitButton, ForgotPasswordLink } from "@/features/auth/components";
import { useAuth } from "@/features/auth/hooks";

export function LoginForm() {
  const form = useForm<ILoginDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { login, isLoginLoading } = useAuth();

  const handleLogin = (formData: ILoginDto) => login(formData);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
        <FormInput
          name="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          icon={Mail}
          control={form.control}
        />
        <FormInput
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          icon={Lock}
          control={form.control}
        />

        <ForgotPasswordLink />

        <AuthSubmitButton isLoading={isLoginLoading} buttonLabel="Sign In" loadingLabel="Signing In..." />
      </form>
    </Form>
  );
}

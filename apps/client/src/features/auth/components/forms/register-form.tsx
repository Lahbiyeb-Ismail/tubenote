"use client";

import type { IRegisterDto } from "@tubenote/dtos";

import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@tubenote/schemas";
import { Lock, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";

import { FormInput } from "@/components/global";
import { Form } from "@/components/ui";

import { useAuth } from "../../hooks";
import { AuthSubmitButton } from "../buttons";

export function RegisterForm() {
  const form = useForm<IRegisterDto>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const { register, isRegisterLoading } = useAuth();

  const handleRegister = (formData: IRegisterDto) => register(formData);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
        <FormInput
          name="username"
          type="username"
          label="Full Name"
          placeholder="Enter your full name"
          icon={User}
          control={form.control}
        />
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
        <AuthSubmitButton
          isLoading={isRegisterLoading}
          buttonLabel="Create Account"
          loadingLabel="Creating Account..."
        />
      </form>
    </Form>
  );
}

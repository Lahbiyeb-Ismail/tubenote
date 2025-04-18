"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";

import type { ILoginDto } from "@tubenote/dtos";
import { loginSchema } from "@tubenote/schemas";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { FormInput } from "../inputs";
import { ForogotPasswordLink } from "../links";

import { useAuth } from "../../contexts";

export function LoginForm() {
  const form = useForm<ILoginDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { login, isLoading } = useAuth();

  const handleLogin = (formData: ILoginDto) => login(formData);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
        <FormInput
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          icon={Mail}
          control={form.control}
        />
        <FormInput
          name="password"
          type="password"
          label="Password"
          placeholder="********"
          icon={Lock}
          control={form.control}
        />
        <ForogotPasswordLink />
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-red-600 to-purple-600 text-white hover:from-red-700 hover:to-purple-700"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}

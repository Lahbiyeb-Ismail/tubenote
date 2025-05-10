"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";

import type { IRegisterDto } from "@tubenote/dtos";
import { registerSchema } from "@tubenote/schemas";

import { Button, Form } from "@/components/ui";

import { FormInput } from "@/components/global";
import { useAuth } from "../../contexts";

export function RegisterForm() {
  const form = useForm<IRegisterDto>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const { registerMutationResult } = useAuth();
  const { mutate: register, isPending } = registerMutationResult;

  const handleRegister = (formData: IRegisterDto) => register(formData);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
        <FormInput
          name="username"
          type="username"
          label="Username"
          placeholder="You Username"
          icon={User}
          control={form.control}
        />
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
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-red-600 to-purple-600 text-white hover:from-red-700 hover:to-purple-700"
          disabled={isPending}
        >
          {isPending ? "Registering..." : "Register"}
        </Button>
      </form>
    </Form>
  );
}

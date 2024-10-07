"use client";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import AuthLayout from "@/components/auth/AuthLayout";

import type { LoginFormData } from "@/types/auth.types";
import { loginFormSchema } from "@/lib/schemas";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Lock, Mail } from "lucide-react";
import FormInput from "@/components/auth/FormInput";
import useLogin from "@/hooks/useLogin";

export default function LoginPage() {
	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const { mutate, isPending, error } = useLogin();

	const handleLogin = (formData: LoginFormData) => mutate(formData);

	return (
		<AuthLayout
			title="Welcome Back"
			description="Login to your account to access your notes"
			error={error?.message}
		>
			<CardContent>
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
						<Button
							type="submit"
							className="w-full bg-gradient-to-r from-red-600 to-purple-600 text-white hover:from-red-700 hover:to-purple-700"
							disabled={isPending}
						>
							{isPending ? "Logging in..." : "Login"}
						</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter className="justify-center">
				<p className="text-sm text-gray-600">
					Don't have an account?{" "}
					<Link href="/register" className="text-red-600 hover:underline">
						Register here
					</Link>
				</p>
			</CardFooter>
		</AuthLayout>
	);
}

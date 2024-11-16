"use client";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Lock, Mail } from "lucide-react";

import AuthLayout from "@/components/auth/AuthLayout";
import FormInput from "@/components/auth/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CardContent, CardFooter } from "@/components/ui/card";

import { loginFormSchema } from "@/lib/schemas";
import { useAuth } from "@/context/useAuth";

import type { LoginFormData } from "@/types/auth.types";
import PasswordResetLink from "../auth/PasswordResetLink";
import GoogleAuthButton from "../auth/GoogleAuthButton";
import { DividerWithText } from "../global/DividerWithText";

function LoginForm() {
	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const { login, isLoading, state } = useAuth();

	const handleLogin = (formData: LoginFormData) => login(formData);

	return (
		<AuthLayout
			title="Welcome Back"
			description="Login to your account to access your notes"
			error={state.errorMessage}
		>
			<GoogleAuthButton />

			<DividerWithText text="Or continue with" />

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
						<PasswordResetLink />
						<Button
							type="submit"
							className="w-full bg-gradient-to-r from-red-600 to-purple-600 text-white hover:from-red-700 hover:to-purple-700"
							disabled={isLoading}
						>
							{isLoading ? "Logging in..." : "Login"}
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

export default LoginForm;

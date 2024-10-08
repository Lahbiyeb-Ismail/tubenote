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

import { type LoginFormData, loginFormSchema } from "@/lib/schemas";
import { useAuth } from "@/context/useAuth";

export default function LoginPage() {
	const { login, state, isLoading } = useAuth();

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleLogin = (formData: LoginFormData) => login(formData);

	return (
		<AuthLayout
			error={state.errorMessage}
			success={state.successMessage}
			pageTitle="Login"
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
					<FormField
						name="email"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="you@example.com" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						name="password"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type="password" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? "Logging in..." : "Login"}
					</Button>
				</form>
			</Form>
			<p className="mt-4 text-center text-sm">
				Don't have an account?{" "}
				<Link
					href="/register"
					className="font-medium text-primary hover:underline"
				>
					Register here
				</Link>
			</p>
		</AuthLayout>
	);
}

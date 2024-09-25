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

import { type RegisterFormData, registerFormSchema } from "@/lib/schemas";
import { useAuth } from "@/context/useAuth";

export default function RegisterPage() {
	const { register, isLoading, state } = useAuth();

	const form = useForm<RegisterFormData>({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
	});

	const handleRegister = (formData: RegisterFormData) => register(formData);

	return (
		<AuthLayout error={state.errorMessage} pageTitle="Register">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(handleRegister)}
					className="space-y-4"
				>
					<FormField
						name="username"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input placeholder="Enter you name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
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
									<Input type="password" placeholder="******" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? "Registering..." : "Register"}
					</Button>
				</form>
			</Form>
			<p className="mt-4 text-center text-sm">
				Already have an account?{" "}
				<Link
					href="/login"
					className="font-medium text-primary hover:underline"
				>
					Login here
				</Link>
			</p>
		</AuthLayout>
	);
}

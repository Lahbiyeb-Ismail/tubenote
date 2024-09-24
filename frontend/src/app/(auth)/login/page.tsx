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

export default function LoginPage() {
	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	return (
		<AuthLayout error="" pageTitle="Login">
			<Form {...form}>
				<form onSubmit={() => {}} className="space-y-4">
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
					<Button type="submit" className="w-full">
						Login
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

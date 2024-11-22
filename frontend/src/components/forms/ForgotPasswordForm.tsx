"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Mail } from "lucide-react";

import AuthLayout from "@/components/auth/AuthLayout";
import FormInput from "@/components/auth/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CardContent, CardFooter } from "@/components/ui/card";

import { forgotPasswordSchema } from "@/lib/schemas";
import useSendForgotPasswordEmail from "@/hooks/password-reset/useSendForgotPasswordEmail";

type ForgotPasswordFormData = {
	email: string;
};

function ForgotPasswordForm() {
	const { mutate, isPending } = useSendForgotPasswordEmail();

	const form = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	const handleForgotPassword = async (formData: ForgotPasswordFormData) => {
		mutate(formData.email);
	};

	return (
		<AuthLayout
			title="Reset Password"
			description="Enter your email to reset your password"
		>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleForgotPassword)}
						className="space-y-4"
					>
						<FormInput
							name="email"
							type="email"
							label="Email"
							placeholder="you@example.com"
							icon={Mail}
							control={form.control}
						/>
						<Button
							type="submit"
							className="w-full bg-gradient-to-r from-red-600 to-purple-600 text-white hover:from-red-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={isPending}
						>
							{isPending ? "Sending..." : "Reset Password"}
						</Button>
					</form>
				</Form>
			</CardContent>

			<CardFooter className="justify-center">
				<p className="text-sm text-gray-600">
					Remember your password?{" "}
					<a href="/login" className="text-red-600 hover:underline">
						Log in here
					</a>
				</p>
			</CardFooter>
		</AuthLayout>
	);
}

export default ForgotPasswordForm;

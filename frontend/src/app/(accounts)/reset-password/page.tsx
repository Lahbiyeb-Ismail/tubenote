"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Mail, ArrowRight } from "lucide-react";

import AuthLayout from "@/components/auth/AuthLayout";
import FormInput from "@/components/auth/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CardContent, CardFooter } from "@/components/ui/card";

import { resetPasswordSchema } from "@/lib/schemas";

type ResetPasswordFormData = {
	email: string;
};

function ResetPasswordPage() {
	const [isSubmitted, setIsSubmitted] = useState(false);

	const form = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	const handleResetPassword = async (formData: ResetPasswordFormData) => {
		// TODO: Implement the actual reset password logic here
		console.log("Reset password for:", formData.email);
		setIsSubmitted(true);
	};

	return (
		<AuthLayout
			title="Reset Password"
			description="Enter your email to reset your password"
		>
			<CardContent>
				{!isSubmitted ? (
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleResetPassword)}
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
								className="w-full bg-gradient-to-r from-red-600 to-purple-600 text-white hover:from-red-700 hover:to-purple-700"
							>
								Reset Password
							</Button>
						</form>
					</Form>
				) : (
					<div className="text-center">
						<div className="mb-4">
							<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500">
								<ArrowRight className="w-8 h-8" />
							</div>
						</div>
						<h3 className="text-lg font-semibold mb-2">Check Your Email</h3>
						<p className="text-gray-600">
							We've sent a password reset link to your email address. Please
							check your inbox and follow the instructions to reset your
							password.
						</p>
					</div>
				)}
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

export default ResetPasswordPage;

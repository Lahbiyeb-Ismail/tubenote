"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Lock } from "lucide-react";

import AuthLayout from "@/components/auth/AuthLayout";
import FormInput from "@/components/auth/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CardContent, CardFooter } from "@/components/ui/card";

import { resetPasswordSchema } from "@/lib/schemas";

import useResetPassword from "@/hooks/password-reset/useResetPassword";
import useVerifyResetToken from "@/hooks/password-reset/useVerifyResetToken";

import PasswordResetLoadingState from "../password-reset/PasswordResetLoadingState";
import PasswordResetErrorState from "../password-reset/PasswordResetErrorState";

type ResetPasswordFormData = {
	password: string;
	confirmPassword: string;
};

type ResetPasswordFormProps = {
	token: string;
};

function ResetPasswordForm({ token }: ResetPasswordFormProps) {
	const { isError, isLoading } = useVerifyResetToken(token);
	const { mutate, isPending } = useResetPassword();

	const form = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const handleResetPassword = async (formData: ResetPasswordFormData) => {
		mutate({ token, password: formData.password });
	};

	if (isLoading) return <PasswordResetLoadingState />;

	if (isError) return <PasswordResetErrorState />;

	return (
		<AuthLayout title="Reset Password" description="Enter your new password">
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleResetPassword)}
						className="space-y-4"
					>
						<FormInput
							name="password"
							type="password"
							label="New Password"
							placeholder="Enter your new password"
							icon={Lock}
							control={form.control}
						/>
						<FormInput
							name="confirmPassword"
							type="password"
							label="Confirm New Password"
							placeholder="Confirm your new password"
							icon={Lock}
							control={form.control}
						/>
						<Button
							type="submit"
							className="w-full bg-gradient-to-r from-red-600 to-purple-600 text-white hover:from-red-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={isPending}
						>
							{isPending ? "Resetting..." : "Reset Password"}
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

export default ResetPasswordForm;

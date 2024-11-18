import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PasswordResetDone() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 p-4">
			<div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
				<div className="mb-6">
					<div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-500">
						<CheckCircle className="w-10 h-10" />
					</div>
				</div>
				<h3 className="text-2xl font-bold mb-4 text-gray-800">
					Check Your Email
				</h3>
				<p className="text-gray-600 mb-6">
					We've sent a password reset link to your email address. Please check
					your inbox and follow the instructions to reset your password.
				</p>
				<div>
					<Button
						asChild
						className="bg-gradient-to-r from-purple-600 to-red-600 text-white hover:from-purple-700 hover:to-red-700"
					>
						<Link href="/login" className="inline-flex items-center">
							Return to Login
							<ArrowRight className="ml-2 w-4 h-4" />
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}

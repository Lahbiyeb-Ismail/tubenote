import { Alert, AlertDescription } from "../ui/alert";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";

import HomeButton from "../global/HomeButton";

import GoogleAuthButton from "./GoogleAuthButton";

type AuthLayoutProps = {
	error?: string;
	success?: string;
	title: string;
	description: string;
	children: React.ReactNode;
};

function AuthLayout({
	error,
	success,
	title,
	description,
	children,
}: AuthLayoutProps) {
	return (
		<div className="relative min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 flex flex-col justify-center items-center p-4">
			<HomeButton />
			<div className="w-full max-w-md">
				<Card className="w-full">
					{error && (
						<Alert
							variant="destructive"
							className="w-[90%] text-center mx-auto mt-3"
						>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					{success && (
						<Alert className="w-[90%] text-center mx-auto mt-3">
							<AlertDescription>{success}</AlertDescription>
						</Alert>
					)}
					<CardHeader>
						<CardTitle className="text-2xl font-bold text-center">
							{title}
						</CardTitle>
						<CardDescription className="text-center">
							{description}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">{children}</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default AuthLayout;

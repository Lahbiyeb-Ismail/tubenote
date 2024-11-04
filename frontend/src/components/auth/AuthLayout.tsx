import { Alert, AlertDescription } from "../ui/alert";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
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
		<div className="h-[100vh] bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 flex flex-col justify-center items-center p-4">
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
					<CardContent className="space-y-4">
						<GoogleAuthButton />
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-t" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground">
									Or continue with
								</span>
							</div>
						</div>
						{children}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default AuthLayout;

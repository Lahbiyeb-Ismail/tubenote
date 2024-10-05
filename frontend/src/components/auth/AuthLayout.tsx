import { Alert, AlertDescription } from "../ui/alert";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

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
		<div className="height_viewport bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 flex flex-col justify-center items-center p-4">
			<div className="w-full max-w-md">
				<Card className="w-full">
					{error && (
						<Alert variant="destructive">
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					{success && (
						<Alert>
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
					{children}
				</Card>
			</div>
		</div>
	);
}

export default AuthLayout;

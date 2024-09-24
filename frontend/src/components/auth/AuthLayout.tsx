import { Alert, AlertDescription } from "../ui/alert";

type AuthLayoutProps = {
	error?: string;
	success?: string;
	pageTitle: string;
	children: React.ReactNode;
};

function AuthLayout({ error, success, pageTitle, children }: AuthLayoutProps) {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
				<h1 className="text-2xl font-bold text-center">{pageTitle}</h1>
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
				{children}
			</div>
		</div>
	);
}

export default AuthLayout;

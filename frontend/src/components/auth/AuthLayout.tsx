import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";

import HomeButton from "../global/HomeButton";

type AuthLayoutProps = {
	title: string;
	description: string;
	children: React.ReactNode;
};

function AuthLayout({ title, description, children }: AuthLayoutProps) {
	return (
		<div className="relative min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 flex flex-col justify-center items-center p-4">
			<HomeButton />
			<div className="w-full max-w-md">
				<Card className="w-full">
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

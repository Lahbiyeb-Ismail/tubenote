import Link from "next/link";

function NotFoundPage() {
	return (
		<div className="flex h-screen flex-col items-center justify-center bg-gray-100">
			<div className="text-center">
				<h1 className="mb-4 text-9xl font-bold text-blue-600">404</h1>
				<h2 className="mb-4 text-4xl font-bold text-gray-800">
					Page Not Found
				</h2>
				<p className="mb-8 text-xl text-gray-600">
					Oops! The page you're looking for doesn't exist.
				</p>
				<Link
					href="/"
					className="rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition duration-300 hover:bg-blue-700"
				>
					Go to Home
				</Link>
			</div>
			<div className="mt-12 text-center">
				<p className="text-gray-600">
					If you believe this is an error, please contact support.
				</p>
			</div>
		</div>
	);
}

export default NotFoundPage;

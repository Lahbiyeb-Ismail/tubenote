import Link from "next/link";

function PasswordResetLink() {
	return (
		<div className="flex justify-end">
			<Link
				href="/password-reset"
				className="text-sm text-red-600 hover:underline"
			>
				Forgot Password?
			</Link>
		</div>
	);
}

export default PasswordResetLink;

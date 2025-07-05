import Link from "next/link";

export function ForgotPasswordLink() {
  return (
    <div className="flex justify-end">
      <Link
        href="/forgot-password"
        className="text-sm text-red-600 hover:text-red-700 hover:underline transition-colors duration-200"
      >
        Forgot Password?
      </Link>
    </div>
  );
}

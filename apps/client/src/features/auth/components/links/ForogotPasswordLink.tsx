import Link from "next/link";

export function ForogotPasswordLink() {
  return (
    <div className="flex justify-end">
      <Link
        href="/forgot-password"
        className="text-sm text-red-600 hover:underline"
      >
        Forgot Password?
      </Link>
    </div>
  );
}

import Link from "next/link";

function ForogotPasswordLink() {
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

export default ForogotPasswordLink;

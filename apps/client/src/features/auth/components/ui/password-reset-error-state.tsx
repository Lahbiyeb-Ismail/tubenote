import { AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function PasswordResetErrorState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Invalid Token</h3>
        <p className="text-red-600 mb-6">
          The reset token is invalid or has expired.
        </p>
        <Button
          asChild
          className="bg-gradient-to-r from-purple-600 to-red-600 text-white hover:from-purple-700 hover:to-red-700"
        >
          <Link href="/login" className="inline-flex items-center">
            Return to Login
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

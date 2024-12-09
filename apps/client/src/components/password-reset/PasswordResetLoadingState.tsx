import { Loader2 } from "lucide-react";

function PasswordResetLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-4 animate-spin">
          <Loader2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold mb-4 text-gray-800">
          Verifying Token
        </h3>
        <p className="text-gray-600">
          Please wait while we verify your reset token...
        </p>
      </div>
    </div>
  );
}

export default PasswordResetLoadingState;

"use client";

import { CheckCircle, Mail } from "lucide-react";
import { useEffect, useState } from "react";

import { HomeButton } from "@/components/global";

export default function VerifyEmail() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Retrieve the email from localStorage or any other state management solution
    const userEmail = localStorage.getItem("userEmail") || "your email";
    setEmail(userEmail);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <HomeButton />

      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-100">
            <Mail className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a verification link to{" "}
            <span className="font-medium text-indigo-600">{email}</span>
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle
                  className="h-5 w-5 text-yellow-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Attention needed
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Please check your email and click on the verification link
                    to complete the registration process. You won't be able to
                    login until your email is verified.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <a
              href="/login"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Proceed to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

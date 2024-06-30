import React from "react";

type ErrorMessageProps = {
  message?: string;
};

function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <p
      className={`mb-2 h-4 text-sm text-red-600 ${message ? "opacity-100" : "opacity-0"}`}
    >
      {message}
    </p>
  );
}

export default ErrorMessage;

"use client";

import { AlertTriangle, ArrowLeft, Bug, Home, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const toggleDetails = () => {
    setShowDetails(prev => !prev);
  };

  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-orange-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-900 dark:text-orange-100">Oops! Something went wrong</CardTitle>

          {error.digest && (
            <Badge variant="secondary" className="mx-auto mt-2">
              Error ID:
              {" "}
              {error.digest}
            </Badge>
          )}

        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-red-700 dark:text-orange-300">
            This page encountered an error and couldn't load properly. You can try refreshing or go back to
            continue using the app.
          </p>

          <div className="flex flex-col items-center justify-center sm:flex-row gap-2">
            <Button onClick={reset} className="flex items-center gap-2 bg-orange-600 text-white hover:bg-orange-700">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>

            <Button
              variant="outline"
              onClick={handleGoBack}
              className="flex items-center gap-2 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>

            <Button
              variant="outline"
              onClick={handleGoHome}
              className="flex items-center gap-2 bg-transparent"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Button>

            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center gap-2 bg-transparent"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>

          {showDetails && (
            <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <code className="text-xs text-orange-700 dark:text-orange-300 break-all">{error?.message}</code>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDetails}
            className="w-full flex items-center justify-center gap-2 text-orange-600 dark:text-orange-400"
          >
            <Bug className="w-4 h-4" />
            {showDetails ? "Hide" : "Show"}
            {" "}
            Details
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

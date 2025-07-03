import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

import { BackgroundAnimation } from "@/components";
import { Logo } from "@/components/global";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";

import { SocialLoginOptions } from "./social-login-options";

export interface AuthPageLayoutProps {
  /**
   * The title of the authentication page
   */
  title: string;
  /**
   * The description text below the title
   */
  description: string;
  /**
   * The main content of the authentication page
   */
  pageContent: React.ReactNode;
  /**
   * The footer content of the authentication page
   */
  pageFooter: React.ReactNode;
  /**
   * Whether to show the social login options section
   * @default true
   */
  showSocialLoginOptions?: boolean;
}

export function AuthPageLayout({
  title,
  description,
  pageContent,
  pageFooter,
  showSocialLoginOptions = true,
}: AuthPageLayoutProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-violet-50 via-blue-50 to-indigo-100"
    >
      {/* Background Animation */}
      <BackgroundAnimation />

      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 animate-fade-in">
          <Link href="/">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>

        <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl animate-scale-in transition-all duration-500 hover:shadow-3xl">
          <CardHeader className="text-center space-y-6 pb-8">
            <Logo size="lg" />

            <div className="space-y-2 animate-fade-in animation-delay-400">
              <CardTitle className="text-3xl font-bold text-gray-900">{title}</CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                {description}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {pageContent}

            {/* Social Login Options */}
            {showSocialLoginOptions && (
              <Fragment>
                <div className="relative animate-fade-in animation-delay-1400">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-gray-500 font-medium">Or continue with</span>
                  </div>
                </div>
                <SocialLoginOptions />
              </Fragment>
            )}
          </CardContent>

          <CardFooter className="justify-center">{pageFooter}</CardFooter>
        </Card>
      </div>
    </div>
  );
}

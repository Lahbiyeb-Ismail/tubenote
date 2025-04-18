import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { DividerWithText } from "@/components/global/DividerWithText";
import HomeButton from "@/components/global/HomeButton";
import { GoogleAuthButton } from "../buttons";

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
   * Whether to show the Google authentication button
   * @default true
   */
  showGoogleAuth?: boolean;
  /**
   * Additional CSS classes for the container
   */
  className?: string;
  /**
   * Additional CSS classes for the card
   */
  cardClassName?: string;
  /**
   * The divider text
   * @default "Or continue with"
   */
  dividerText?: string;
  /**
   * Override the default background gradient
   */
  backgroundStyle?: React.CSSProperties;
  /**
   * Use a custom background class instead of the default gradient
   */
  backgroundClassName?: string;
  /**
   * Whether to show the home button
   * @default true
   */
  showHomeButton?: boolean;
}

export function AuthPageLayout({
  title,
  description,
  pageContent,
  pageFooter,
  backgroundStyle,
  backgroundClassName,
  showGoogleAuth = true,
  showHomeButton = true,
  className = "",
  cardClassName = "",
  dividerText = "Or continue with",
}: AuthPageLayoutProps) {
  // Determine the background class to use
  const bgClass =
    backgroundClassName ||
    "bg-gradient-to-br from-purple-100 via-pink-100 to-red-100";

  return (
    <div
      className={`relative min-h-screen flex flex-col justify-center items-center p-4 ${bgClass} ${className}`}
      style={backgroundStyle}
    >
      {showHomeButton && <HomeButton />}

      <div className="w-full max-w-md">
        <Card className={`w-full shadow-xl ${cardClassName}`}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {title}
            </CardTitle>
            <CardDescription className="text-center">
              {description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {showGoogleAuth && (
              <>
                <GoogleAuthButton />
                <DividerWithText text={dividerText} />
              </>
            )}

            {pageContent}
          </CardContent>

          <CardFooter className="justify-center">{pageFooter}</CardFooter>
        </Card>
      </div>
    </div>
  );
}

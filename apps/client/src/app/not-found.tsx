"use client";

import { ArrowLeft, FileText, Home, RefreshCw, Settings, Video } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  const router = useRouter();

  const quickLinks = [
    {
      href: "/",
      icon: Home,
      label: "Home",
      description: "Return to homepage",
    },
    {
      href: "/dashboard",
      icon: Video,
      label: "Dashboard",
      description: "View your videos",
    },
    {
      href: "/notes",
      icon: FileText,
      label: "Notes",
      description: "Browse your notes",
    },
    {
      href: "/settings",
      icon: Settings,
      label: "Settings",
      description: "Account settings",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-[12rem] md:text-[16rem] font-bold text-slate-200 dark:text-slate-700 leading-none select-none">
            404
          </div>
        </div>

        {/* Main Message */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100">Page Not Found</h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Oops! The page you're looking for seems to have vanished into the digital void. Don't worry, we'll help you
            find your way back.
          </p>
        </div>

        {/* Quick Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {quickLinks.map(link => (
            <Link key={link.href} href={link.href}>
              <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer group">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                    <link.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{link.label}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{link.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button onClick={() => router.back()} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Link href="/">
            <Button className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Return Home
            </Button>
          </Link>
          <Button onClick={() => window.location.reload()} variant="ghost" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh Page
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-sm text-slate-500 dark:text-slate-400 space-y-2">
          <p>
            If you believe this is an error, please
            {" "}
            <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
              contact support
            </Link>
          </p>
          <p>Error Code: 404 - Page Not Found</p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full opacity-50 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-5 w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full opacity-50 animate-pulse delay-500"></div>
      </div>
    </div>
  );
}

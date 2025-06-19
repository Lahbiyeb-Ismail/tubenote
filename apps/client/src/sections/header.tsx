"use client";

import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

import { NavigationHeader, NavLink, UserProfileMenu } from "@/components";
import { Button } from "@/components/ui";
import { useAuthStore } from "@/features/auth/store";

const navLinks = [
  {
    href: "#features",
    label: "Features",
  },
  {
    href: "#how-it-works",
    label: "How it Works",
  },
  {
    href: "#pricing",
    label: "Pricing",
  },
  {
    href: "#faq",
    label: "FAQ",
  },
];

export function Header() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return (
      <NavigationHeader navLinks={navLinks}>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 ml-8">
            <NavLink href="/dashboard">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </NavLink>
          </nav>
          <UserProfileMenu />
        </div>
      </NavigationHeader>
    );
  }

  return (
    <NavigationHeader navLinks={navLinks}>
      <div className="flex items-center gap-4">
        <Link href="/login">
          <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
            Sign In
          </Button>
        </Link>
        <Link href="/register">
          <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            Get Started
          </Button>
        </Link>
      </div>
    </NavigationHeader>
  );
}

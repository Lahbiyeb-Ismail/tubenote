import Link from "next/link";

import { Logo } from "@/components/global";
import { Button } from "@/components/ui";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="#features" className="text-gray-600 hover:text-red-600 transition-colors">Features</Link>
          <Link href="#how-it-works" className="text-gray-600 hover:text-red-600 transition-colors">How it Works</Link>
          <Link href="#pricing" className="text-gray-600 hover:text-red-600 transition-colors">Pricing</Link>
          <Link href="#faq" className="text-gray-600 hover:text-red-600 transition-colors">FAQ</Link>
        </nav>

        <div className="flex items-center space-x-3">
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
      </div>
    </header>
  );
}

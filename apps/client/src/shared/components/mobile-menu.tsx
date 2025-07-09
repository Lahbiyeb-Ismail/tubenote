"use client";

import { Menu } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/features/auth/hooks";
import { useUIStore } from "@/stores";

import { AuthenticationButtons } from "./authentication-buttons";
import { UserProfileMenu } from "./user-profile-menu";

interface IProps {
  isActive: (href: string) => boolean;
  navItems: Array<{
    href: string;
    label: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }>;
}

export function MobileMenu({ isActive, navItems }: IProps) {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useUIStore();
  const { isAuthenticated } = useAuth();

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col space-y-4 mt-6">
          <nav className="flex flex-col space-y-2">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors hover:text-primary p-2 rounded-md ${
                  isActive(item.href) ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-accent"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {isAuthenticated
            ? (
                <UserProfileMenu variant="mobile" />
              )
            : (
                <div className="border-t pt-4 space-y-2">
                  <AuthenticationButtons className="w-full" onClick={() => setIsMobileMenuOpen(false)} />
                </div>
              )}

        </div>
      </SheetContent>
    </Sheet>
  );
}

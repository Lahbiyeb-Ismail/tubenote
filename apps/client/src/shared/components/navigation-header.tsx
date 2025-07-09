"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AuthNavActions, Logo } from "@/shared/components";

import { NavLink } from "./nav-link";

const MobileMenu = dynamic(
  () => import("./mobile-menu").then(mod => mod.MobileMenu),
  { ssr: false },
);

interface IProps {
  navItems: Array<{ href: string; label: string; icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> }>;
}

export function NavigationHeader({ navItems }: IProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/")
      return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map(item => (
            <NavLink
              key={item.href}
              href={item.href}
            >
              {item.icon && <item.icon className="size-4" />}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Actions */}
        <AuthNavActions />

        {/* Mobile Menu */}
        <MobileMenu navItems={navItems} isActive={isActive} />
      </div>
    </header>
  );
}

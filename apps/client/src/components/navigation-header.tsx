"use client";

import Link from "next/link";

import { Logo } from "@/components/global";

import { NavLink } from "./nav-link";

interface IProps {
  navLinks: Array<{ href: string; label: string; icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> }>;
  children: React.ReactNode;
}

export function NavigationHeader({ navLinks, children }: IProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-slate-950/80 dark:border-slate-800">
      <div className="container flex h-16 items-center">
        <Link href="/">
          <Logo />
        </Link>

        <div className="w-full flex items-center justify-between gap-4">
          <nav className="hidden md:flex items-center gap-6 ml-8">
            {navLinks.map(link => (
              <NavLink key={link.href} href={link.href}>
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label}
              </NavLink>
            ))}
          </nav>
          {children}
        </div>
      </div>
    </header>
  );
}

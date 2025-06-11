"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "./ui";

interface IProps {
  href: string;
  children: React.ReactNode;
}

export function NavLink({ href, children }: IProps) {
  const isActive = href === usePathname();

  return (
    <Link href={href}>
      <Button variant="ghost" className={`gap-2  dark:bg-slate-800 ${isActive ? "bg-slate-100" : ""}`}>
        {children}
      </Button>
    </Link>
  );
}

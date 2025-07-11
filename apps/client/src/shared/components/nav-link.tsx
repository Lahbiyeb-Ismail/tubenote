"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib";

interface IProps {
  navItem: {
    href: string;
    label: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  };
  className?: string;
  onClick?: () => void;
}

export function NavLink({ navItem, className, onClick }: IProps) {
  const pathname = usePathname();

  const isActive = navItem.href === pathname;

  return (
    <Link href={navItem.href} className={cn(`flex items-center gap-2 font-medium transition-colors hover:text-primary p-2 rounded-md  dark:bg-slate-800 ${isActive ? "text-primary bg-primary/10" : "text-muted-foreground "}`, className)} onClick={onClick}>
      {navItem.icon && <navItem.icon className="size-4" />}
      <span>{navItem.label}</span>
    </Link>
  );
}

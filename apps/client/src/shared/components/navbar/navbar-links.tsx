"use client";

import { usePathname } from "next/navigation";

import { navItems } from "@/shared/utils";

import { NavbarLink } from "./";

export function NavbarLinks() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex items-center justify-evenly flex-grow">
      {navItems.map(item => (
        <NavbarLink
          key={item.name}
          name={item.name}
          icon={item.icon}
          href={item.href}
          pathname={pathname}
        />
      ))}
    </div>
  );
}

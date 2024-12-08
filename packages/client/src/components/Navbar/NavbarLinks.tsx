"use client";

import { usePathname } from "next/navigation";

import { navItems } from "@/utils/constants";
import NavLink from "./NavLink";

function NavbarLinks() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex items-center justify-evenly flex-grow">
      {navItems.map((item) => (
        <NavLink
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

export default NavbarLinks;

import Link from "next/link";

import { Button } from "./ui";

interface IProps {
  href: string;
  children: React.ReactNode;
}

export function NavLink({ href, children }: IProps) {
  const isActive = href === window.location.pathname;
  return (
    <Link href={href}>
      <Button variant="ghost" className={`gap-2  dark:bg-slate-800 ${isActive ? "bg-slate-100" : ""}`}>
        {children}
      </Button>
    </Link>
  );
}

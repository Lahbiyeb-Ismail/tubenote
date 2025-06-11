import Link from "next/link";

import { Logo } from "@/components/global";

interface IProps {
  leftNavigationLinks: React.ReactNode;
  rightNavigationLinks: React.ReactNode;
}

export function NavigationHeader({ leftNavigationLinks, rightNavigationLinks }: IProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-sm dark:bg-slate-950/80 dark:border-slate-800">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-6 ml-8">
            {leftNavigationLinks}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {rightNavigationLinks}
        </div>
      </div>
    </header>
  );
}

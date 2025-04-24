import { Logo, MaxWidthWrapper } from "@/components/global";
import { NavbarButtons } from "./";

export function Navbar() {
  return (
    <header className="sticky inset-x-0 top-0 z-[49] h-14 w-full backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <nav className="flex h-14 items-center justify-between">
          <Logo />
          <NavbarButtons />
        </nav>
      </MaxWidthWrapper>
    </header>
  );
}

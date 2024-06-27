import MaxWidthWrapper from "./MaxWidthWrapper";
import NavbarButtons from "./NavbarButtons";
import TubeNoteLogo from "./TubenoteLogo";

function Navbar() {
  return (
    <header className="sticky inset-x-0 top-0 z-[100] h-14 w-full backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <nav className="flex h-14 items-center justify-between">
          <TubeNoteLogo />
          <NavbarButtons />
        </nav>
      </MaxWidthWrapper>
    </header>
  );
}

export default Navbar;

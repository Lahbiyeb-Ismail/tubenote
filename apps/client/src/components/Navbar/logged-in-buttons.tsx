import { DropDownNavbar, NavbarLinks } from "./";

export function LoggedInButtons() {
  return (
    <div className="md:flex-grow flex justify-between gap-4">
      <NavbarLinks />
      <DropDownNavbar />
    </div>
  );
}

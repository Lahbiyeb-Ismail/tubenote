import DropDownNavbar from "./DropDownNavbar";
import NavbarLinks from "./NavbarLinks";

function LoggedInButtons() {
  return (
    <div className="md:flex-grow flex justify-between gap-4">
      <NavbarLinks />
      <DropDownNavbar />
    </div>
  );
}

export default LoggedInButtons;

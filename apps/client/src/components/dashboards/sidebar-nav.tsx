import { sidebarMenuLinks } from "@/utils/constants";
import SidebarLink from "./SidebarLink";

type SidebarNavProps = {
  pathname: string;
  isOpen: boolean;
};

function SidebarNav({ pathname, isOpen }: SidebarNavProps) {
  return (
    <nav
      className={`flex-grow transition-all duration-300 ${
        isOpen ? "px-4" : "px-0"
      }`}
    >
      <ul className="space-y-2">
        {sidebarMenuLinks.map((item) => (
          <SidebarLink
            key={item.name}
            item={item}
            pathname={pathname}
            isOpen={isOpen}
          />
        ))}
      </ul>
    </nav>
  );
}

export default SidebarNav;

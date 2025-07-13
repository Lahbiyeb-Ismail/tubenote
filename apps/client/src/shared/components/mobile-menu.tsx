import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useGetCurrentUserQuery } from "@/features/user/queries";
import { useUIStore } from "@/stores";

import { AuthenticationButtons } from "./authentication-buttons";
import { NavLink } from "./nav-link";
import { UserProfileMenu } from "./user-profile-menu";

interface IProps {
  navItems: Array<{
    href: string;
    label: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }>;
}

export function MobileMenu({ navItems }: IProps) {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useUIStore();
  const { isSuccess: isAuthenticated } = useGetCurrentUserQuery();

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col space-y-4 mt-6">
          <nav className="flex flex-col space-y-2">
            {navItems.map(item => (
              <NavLink
                key={item.href}
                navItem={item}
                onClick={() => setIsMobileMenuOpen(false)}
              />
            ))}
          </nav>

          {isAuthenticated
            ? (
                <UserProfileMenu variant="mobile" closeMobileMenu={() => setIsMobileMenuOpen(false)} />
              )
            : (
                <div className="border-t pt-4 space-y-2">
                  <AuthenticationButtons className="w-full" onClick={() => setIsMobileMenuOpen(false)} />
                </div>
              )}

        </div>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import { LayoutDashboard, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Separator } from "@/components/ui";
import { useAuth } from "@/features/auth/hooks";
import { useGetCurrentUserQuery } from "@/features/user/queries";

import { UserProfileMenuSkeleton } from "./user-profile-menu-skeleton";

// Default profile picture URL
const FALLBACK_PROFILE_IMAGE_URL = "https://github.com/shadcn.png";

interface IProps {
  variant?: "mobile" | "desktop";
  closeMobileMenu?: () => void;
}

export function UserProfileMenu({ variant = "desktop", closeMobileMenu }: IProps) {
  const { data: user, isLoading: isUserLoading } = useGetCurrentUserQuery();

  const { logout, isLogoutLoading } = useAuth();

  if (isUserLoading || !user)
    return <UserProfileMenuSkeleton />;

  const userProfilePicture = user.profilePicture ?? FALLBACK_PROFILE_IMAGE_URL;

  if (variant === "desktop") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userProfilePicture} alt="User" />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.username}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <Link href="/profile">
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/settings">
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="cursor-pointer" onClick={() => logout()} disabled={isLogoutLoading}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="border-t pt-4">
      <div className="flex items-center space-x-2 p-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={userProfilePicture} alt="User" />
          <AvatarFallback>US</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{user.username}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
      </div>

      <div className="flex flex-col space-y-2 mt-2">
        <Button variant="ghost" className="justify-start" size="sm" asChild>
          <Link href="/dashboard" onClick={closeMobileMenu}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </Button>

        <Button variant="ghost" className="justify-start" size="sm" asChild>
          <Link href="/profile" onClick={closeMobileMenu}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </Button>

        <Button variant="ghost" className="justify-start" size="sm" asChild>
          <Link href="/settings" onClick={closeMobileMenu}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </Button>

        <Separator className="my-2" />

        <Button
          variant="ghost"
          className="justify-start"
          size="sm"
          onClick={() => {
            logout();
            closeMobileMenu?.();
          }}
          disabled={isLogoutLoading}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </Button>
      </div>
    </div>
  );
}

"use client";

import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";

import { useLogout } from "@/features/auth/hooks";
import { useGetCurrentUser } from "@/features/user/hooks";

import { Avatar, AvatarFallback, AvatarImage, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui";
import { UserProfileMenuSkeleton } from "./user-profile-menu-skeleton";

// Default profile picture URL
const FALLBACK_PROFILE_IMAGE_URL = "https://github.com/shadcn.png";

export function UserProfileMenu() {
  const { data: user, isPending: isLoadingUser } = useGetCurrentUser();

  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  if (isLoadingUser || !user)
    return <UserProfileMenuSkeleton />;

  const imgSrc = user.profilePicture ?? FALLBACK_PROFILE_IMAGE_URL;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={imgSrc} />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline">{user.username}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Link href="/profile">
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
        </Link>
        <Link href="/settings">
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem className="cursor-pointer" onClick={() => logout()} disabled={isLoggingOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

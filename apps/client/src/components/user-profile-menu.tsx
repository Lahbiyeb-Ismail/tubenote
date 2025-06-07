import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { Fragment } from "react";

import { useUserStore } from "@/features/user/store";

import { Avatar, AvatarFallback, AvatarImage, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui";

export function UserProfileMenu() {
  const { currentUser } = useUserStore();
  const src = "https://github.com/shadcn.png";

  const imgSrc = currentUser?.profilePicture ?? src;

  return (
    <Fragment>
      <Button variant="ghost" size="icon">
        <Bell className="h-4 w-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={imgSrc} />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
            <span className="hidden md:inline">{currentUser?.username}</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  );
}

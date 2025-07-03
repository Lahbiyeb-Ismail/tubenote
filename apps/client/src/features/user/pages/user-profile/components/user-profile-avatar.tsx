import type { User } from "@tubenote/db";

import { Camera } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface IProps {
  user: User;
}

export function UserProfileAvatar({ user }: IProps) {
  return (
    <div className="relative group">
      <Avatar className="w-32 h-32 ring-4 ring-white shadow-xl">
        <AvatarImage src="https://github.com/shadcn.png" alt={user.username} />
        <AvatarFallback className="text-2xl font-semibold bg-gradient-to-r from-red-500 to-pink-500 text-white">
          {user.username.split(" ").map(n => n[0]).join("")}
        </AvatarFallback>
      </Avatar>
      <Button
        size="icon"
        variant="secondary"
        // onClick={handleAvatarChange}
        className="absolute bottom-2 right-2 w-10 h-10 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
      >
        <Camera className="h-4 w-4" />
      </Button>
    </div>
  );
}

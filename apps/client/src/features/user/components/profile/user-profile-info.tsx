import type { User } from "@tubenote/db";

import { Calendar, Edit, Mail, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";

interface IProps {
  user: User;
  setIsEditing: (value: boolean) => void;
  isEditing: boolean;
}

export function UserProfileInfo({ user, setIsEditing, isEditing }: IProps) {
  return (
    <div className="flex-1 text-center md:text-left">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.username}</h1>
          <div className="flex items-center justify-center md:justify-start space-x-4 text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <Mail className="h-4 w-4" />
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Morocco</span>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-start space-x-1 text-gray-500 mb-4">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">
              Joined
              {/* {user.createdAt.toISOString()} */}
            </span>
          </div>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Edit className="h-4 w-4 mr-2" />
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      {/* <p className="text-gray-700 leading-relaxed mb-6">{user.bio}</p> */}

      {/* Stats */}
      {/* <div className="flex flex-wrap justify-center md:justify-start gap-4">
        <Badge variant="secondary" className="px-4 py-2 text-sm">
          {user.notesCount}
          {" "}
          Notes
        </Badge>
        <Badge variant="secondary" className="px-4 py-2 text-sm">
          {user.tagsCount}
          {" "}
          Tags
        </Badge>
        <Badge variant="secondary" className="px-4 py-2 text-sm">
          {user.favoriteNotes}
          {" "}
          Favorites
        </Badge>
      </div> */}
    </div>
  );
}

import { AlertTriangle, Calendar, CheckCircle, User } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UserInfoProps = {
  username: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
};

export function UserInfo({
  username,
  email,
  emailVerified,
  createdAt,
}: UserInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <User className="mr-2" />
        User Information
      </h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={username} readOnly />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <div className="flex items-center">
            <Input id="email" value={email} readOnly className="flex-grow" />
            {emailVerified ? (
              <CheckCircle className="ml-2 text-green-500" />
            ) : (
              <AlertTriangle className="ml-2 text-yellow-500" />
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="joinDate">Join Date</Label>
          <div className="flex items-center">
            <Calendar className="mr-2 text-gray-500" />
            <Input
              id="joinDate"
              value={new Date(createdAt).toLocaleDateString()}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { EditProfileForm } from "./edit-profile-form";

interface IProps {
  setIsEditing: (isEditing: boolean) => void;
}

export function EditProfileContainer({ setIsEditing }: IProps) {
  return (
    <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <EditProfileForm onCancel={() => setIsEditing(false)} />
      </CardContent>
    </Card>
  );
}

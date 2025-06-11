"use client";

import type { IUpdateUserDto } from "@tubenote/dtos";

import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema } from "@tubenote/schemas";
import { Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";

import { FormInput } from "@/components/global";
import { Form } from "@/components/ui";
import { Button } from "@/components/ui/button";

import { useGetCurrentUser, useUpdateUser } from "../../hooks";

interface IProps {
  onCancel: () => void;
}

export function EditProfileForm({ onCancel }: IProps) {
  const { data: user } = useGetCurrentUser();
  const { mutate: updateUser, isPending } = useUpdateUser();

  const form = useForm<IUpdateUserDto>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: user?.username ?? "",
      email: user?.email ?? "",
    },
  });

  const handleUpdateProfile = (data: IUpdateUserDto) => {
    updateUser(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleUpdateProfile)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormInput
            name="username"
            label="Username"
            placeholder="Your Username"
            icon={User}
            control={form.control}
          />

          <FormInput
            name="email"
            label="Email Address"
            placeholder="Your Email Address"
            icon={Mail}
            control={form.control}
          />
        </div>

        {/* <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={e => handleChange("location", e.target.value)}
            placeholder="Enter your location"
          />
        </div> */}

        {/* <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
        id="bio"
        value={formData.bio}
        onChange={e => handleChange("bio", e.target.value)}
          placeholder="Tell us about yourself"
          rows={4}
        />
      </div> */}

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

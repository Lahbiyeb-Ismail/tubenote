"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";

import type { IUpdateUserDto } from "@tubenote/dtos";
import { updateUserSchema } from "@tubenote/schemas";

import { Button, Form } from "@/components/ui";
import { FormInput } from "@/features/auth/components";

import { useUser } from "../../contexts";
import { useGetCurrentUser } from "../../hooks";

export function UpdateUserForm() {
  const { data: response } = useGetCurrentUser();

  const form = useForm<IUpdateUserDto>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: response?.payload.data.username ?? "",
      email: response?.payload.data.email ?? "",
    },
  });

  const { updateUser, isLoading } = useUser();

  const handleUpdateProfile = (data: IUpdateUserDto) => {
    updateUser(data);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <User className="mr-2" />
        Profile Information
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdateProfile)}
          className="space-y-4"
        >
          <FormInput
            name="username"
            label="Username"
            placeholder="Your Username"
            icon={User}
            control={form.control}
          />
          <FormInput
            name="email"
            type="email"
            label="Email"
            placeholder="your.email@example.com"
            icon={Mail}
            control={form.control}
          />
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-purple-600 text-white
						hover:from-red-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

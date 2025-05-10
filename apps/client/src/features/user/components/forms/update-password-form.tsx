"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";

import type { IUpdatePasswordDto } from "@tubenote/dtos";
import { updatePasswordSchema } from "@tubenote/schemas";

import { Button, Form } from "@/components/ui";

import { FormInput } from "@/components/global";

import { useUpdatePassword } from "../../hooks";

export function UpdatePasswordForm() {
  const form = useForm<IUpdatePasswordDto>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      // confirmPassword: "",
    },
  });

  const { mutate, isPending } = useUpdatePassword();

  const handleUpdatePassword = (data: IUpdatePasswordDto) => {
    mutate(data);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <Lock className="mr-2" />
        Update Password
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdatePassword)}
          className="space-y-4"
        >
          <FormInput
            name="currentPassword"
            label="Current Password"
            placeholder="Enter current password"
            type="password"
            icon={Lock}
            control={form.control}
          />
          <FormInput
            name="newPassword"
            label="New Password"
            placeholder="Enter new password"
            type="password"
            icon={Lock}
            control={form.control}
          />
          {/* <FormInput
            name="confirmPassword"
            type="password"
            label="Confirm New Password"
            placeholder="Confirm new password"
            icon={Lock}
            control={form.control}
          /> */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-purple-600 text-white hover:from-red-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isPending}
          >
            {isPending ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

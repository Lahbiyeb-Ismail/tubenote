"use client";

import type { IUpdatePasswordDto } from "@tubenote/dtos";

import { zodResolver } from "@hookform/resolvers/zod";
import { updatePasswordSchema } from "@tubenote/schemas";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";

import { FormInput } from "@/components/global";
import { Button, Form } from "@/components/ui";

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
          disabled={isPending}
          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:cursor-not-allowed"
        >
          {isPending ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </Form>
  );
}

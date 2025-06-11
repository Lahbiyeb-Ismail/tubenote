import type { LucideIcon } from "lucide-react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

import { Eye, EyeOff } from "lucide-react";
import React from "react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui";

interface FormInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  placeholder: string;
  label: string;
  control: Control<T>;
  type?: string;
  icon?: LucideIcon;
}

export function FormInput<T extends FieldValues>({
  name,
  label,
  placeholder,
  control,
  icon: Icon,
  type = "text",
}: FormInputProps<T>) {
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel className="text-sm font-semibold text-gray-700">{label}</FormLabel>
          <FormControl>
            <div className="relative group">
              {!!Icon && (
                <Icon className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
              )}

              <Input
                {...field}
                id={name}
                type={
                  type === "password"
                    ? showPassword
                      ? "text"
                      : "password"
                    : type
                }
                placeholder={placeholder}
                className={`pl-12 h-12 text-lg border-2 transition-all duration-300 focus:border-red-500 focus:ring-red-500/20 focus:ring-4 ${control._formState.errors[name] ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
              />

              {type === "password"
                && (
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword
                      ? (
                          <EyeOff className="h-5 w-5" />
                        )
                      : (
                          <Eye className="h-5 w-5" />
                        )}
                  </button>
                )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

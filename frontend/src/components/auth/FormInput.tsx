import React from "react";
import type { Control, FieldValues, FieldPath } from "react-hook-form";
import type { LucideIcon } from "lucide-react";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

type FormInputProps<T extends FieldValues> = {
	name: FieldPath<T>;
	type?: string;
	placeholder: string;
	label: string;
	control: Control<T>;
	icon: LucideIcon;
};

function FormInput<T extends FieldValues>({
	name,
	label,
	placeholder,
	type = "text",
	icon: Icon,
	control,
}: FormInputProps<T>) {
	return (
		<FormField
			name={name}
			control={control}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<div className="relative">
							<Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
							<Input
								{...field}
								id={name}
								type={type}
								placeholder={placeholder}
								className="pl-10"
							/>
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export default FormInput;

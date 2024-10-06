import React from "react";
import type { Control, FieldValues, FieldPath } from "react-hook-form";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";

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
	const [showPassword, setShowPassword] = React.useState(false);

	const togglePasswordVisibility = () => setShowPassword(!showPassword);
	return (
		<FormField
			name={name}
			control={control}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<div className="relative">
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
							/>
							{type === "password" ? (
								<button
									type="button"
									onClick={togglePasswordVisibility}
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
								>
									{showPassword ? (
										<EyeOff className="h-5 w-5 text-gray-400" />
									) : (
										<Eye className="h-5 w-5 text-gray-400" />
									)}
								</button>
							) : (
								<Icon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
							)}
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export default FormInput;

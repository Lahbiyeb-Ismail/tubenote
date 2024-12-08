"use client";

import React from "react";
import Link from "next/link";

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Printer } from "lucide-react";

export type BreadcrumbItemType = {
	href: string;
	label: string;
	isCurrent?: boolean;
};

type ActionButton = {
	href: string;
	label: string;
	icon?: React.ReactNode;
};

type ToggleOption = {
	id: string;
	label: string;
	checked: boolean;
	onChange: () => void;
};

type NavigationHeaderProps = {
	breadcrumbs: BreadcrumbItemType[];
	actionButton?: ActionButton;
	toggleOption?: ToggleOption;
};

function NavigationHeader({
	breadcrumbs,
	actionButton,
	toggleOption,
}: NavigationHeaderProps) {
	return (
		<header className="border-b bg-muted/40 dark:from-gray-800 dark:to-gray-900">
			<div className="container py-4 px-6">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
					<Breadcrumb>
						<BreadcrumbList>
							{breadcrumbs.map((item, index) => (
								<React.Fragment key={item.href}>
									<BreadcrumbItem>
										<BreadcrumbLink
											href={item.href}
											className={
												item.isCurrent
													? "font-semibold text-gray-800 dark:text-gray-200"
													: "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
											}
										>
											{item.label}
										</BreadcrumbLink>
									</BreadcrumbItem>
									{index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
								</React.Fragment>
							))}
						</BreadcrumbList>
					</Breadcrumb>
					<div className="flex items-center space-x-4">
						{actionButton && (
							<Button
								variant="outline"
								size="sm"
								asChild
								className="bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-gray-500 transition-all duration-300 shadow-sm hover:shadow"
							>
								<Link href={actionButton.href}>
									{actionButton.icon && (
										<span className="mr-2">{actionButton.icon}</span>
									)}
									{actionButton.label}
								</Link>
							</Button>
						)}

						{toggleOption && (
							<div className="flex items-center space-x-2">
								<Switch
									id={toggleOption.id}
									checked={toggleOption.checked}
									onCheckedChange={toggleOption.onChange}
									className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-200 dark:data-[state=unchecked]:bg-gray-700"
								/>
								<Label
									htmlFor={toggleOption.id}
									className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none"
								>
									{toggleOption.label}
								</Label>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}

export default NavigationHeader;

import React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md px-5 py-3 text-center text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-2 bg-primary text-white hover:border-primary hover:bg-white hover:text-primary focus:ring-primary dark:focus:ring-primary",
        secondary:
          "border border-gray-300 text-gray-900 hover:bg-gray-100 focus:ring-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800",
      },
      size: {
        default: "px-5 py-3",
        md: "px-5 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href: string;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLAnchorElement, ButtonProps>(
  ({ children, className, variant, size, href, ...props }, ref) => {
    return (
      <Link
        ref={ref}
        {...props}
        href={href}
        className={cn(buttonVariants({ variant, size, className }))}
      >
        {children}
      </Link>
    );
  }
);

export { Button, buttonVariants };

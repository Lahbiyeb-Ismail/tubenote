import type { Config } from "tailwindcss";

import tailwindcssTypographyPlugin from "@tailwindcss/typography";
import tailwindcssAnimatePlugin from "tailwindcss-animate";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Primary Colors
        "primary": "#6366F1", // Brand anchor + CTA power - indigo-500
        "primary-50": "#EEF2FF", // Light indigo (50-level shade) - indigo-50
        "primary-100": "#E0E7FF", // Light indigo (100-level shade) - indigo-100
        "primary-200": "#C7D2FE", // Light indigo (200-level shade) - indigo-200
        "primary-500": "#6366F1", // Medium indigo (500-level shade) - indigo-500
        "primary-600": "#4F46E5", // Dark indigo (600-level shade) - indigo-600
        "primary-700": "#4338CA", // Darker indigo (700-level shade) - indigo-700
        "primary-900": "#312E81", // Darkest indigo (900-level shade) - indigo-900

        // Secondary Colors
        "secondary": "#EC4899", // Supporting hierarchy - pink-500
        "secondary-50": "#FDF2F8", // Light pink (50-level shade) - pink-50
        "secondary-100": "#FCE7F3", // Light pink (100-level shade) - pink-100
        "secondary-200": "#FBCFE8", // Light pink (200-level shade) - pink-200
        "secondary-500": "#EC4899", // Medium pink (500-level shade) - pink-500
        "secondary-600": "#DB2777", // Dark pink (600-level shade) - pink-600
        "secondary-700": "#BE185D", // Darker pink (700-level shade) - pink-700

        // Accent Colors
        "accent": {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },

        // Background Colors
        "background": "#FFFFFF", // Clean canvas for content - white
        "surface": "#F8FAFC", // Section separation without borders - slate-50
        "surface-100": "#F1F5F9", // Light surface (100-level shade) - slate-100
        "surface-200": "#E2E8F0", // Medium surface (200-level shade) - slate-200

        // Text Colors
        "text-primary": "#1F2937", // High contrast for scanning - gray-800
        "text-secondary": "#6B7280", // Supporting without distraction - gray-500
        "text-muted": "#9CA3AF", // Muted text - gray-400

        // Status Colors
        "success": "#10B981", // Positive reinforcement - emerald-500
        "success-50": "#ECFDF5", // Light success (50-level shade) - emerald-50
        "success-100": "#D1FAE5", // Light success (100-level shade) - emerald-100
        "success-600": "#059669", // Dark success (600-level shade) - emerald-600

        "warning": "#F59E0B", // Scarcity/urgency if needed - amber-500
        "warning-50": "#FFFBEB", // Light warning (50-level shade) - amber-50
        "warning-100": "#FEF3C7", // Light warning (100-level shade) - amber-100

        "error": "#EF4444", // Form validation only - red-500
        "error-50": "#FEF2F2", // Light error (50-level shade) - red-50
        "error-100": "#FEE2E2", // Light error (100-level shade) - red-100
        "error-600": "#DC2626", // Dark error (600-level shade) - red-600

        // Border Colors
        "border": "#E5E7EB", // Form inputs and section dividers - gray-200
        "border-focus": "#6366F1", // Active form states - indigo-500

        "muted": {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },

         popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        }
      },
      fontSize: {
        "xs": ["0.75rem", { lineHeight: "1rem" }],
        "sm": ["0.875rem", { lineHeight: "1.25rem" }],
        "base": ["1rem", { lineHeight: "1.5rem" }],
        "lg": ["1.125rem", { lineHeight: "1.75rem" }],
        "xl": ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      boxShadow: {
        cta: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      borderWidth: {
        3: "3px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimatePlugin, tailwindcssTypographyPlugin],
} satisfies Config;

export default config;

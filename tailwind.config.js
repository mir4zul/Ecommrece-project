import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

function withOpacity(variableName) {
    return ({ opacityValue }) => {
        if (opacityValue !== undefined) {
            return `rgba(var(${variableName}), ${opacityValue})`;
        }
        return `rgb(var(${variableName}))`;
    };
}

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: [
                    "var(--font-sans)",
                    "ui-sans-serif",
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "Segoe UI Variable Display",
                    "Segoe UI",
                    "Helvetica",
                    "Apple Color Emoji",
                    "Arial",
                    "sans-serif",
                    "Segoe UI Emoji",
                    "Segoe UI Symbol",
                    "Noto Color Emoji",
                ],
                openSans: ['Open Sans"', "sans-serif"],
                heading: [
                    "var(--font-heading)",
                    "ui-sans-serif",
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "Segoe UI Variable Display",
                    "Segoe UI",
                    "Helvetica",
                    "Apple Color Emoji",
                    "Arial",
                    "sans-serif",
                    "Segoe UI Emoji",
                    "Segoe UI Symbol",
                    "Noto Color Emoji",
                ],
                mono: [
                    "var(--font-mono)",
                    ...require("tailwindcss/defaultTheme").fontFamily.mono,
                ],
            },
            backgroundColor: {
                primary: 'withOpacity("--background-primary-color")',
                secondary: 'withOpacity("--background-secondary-color")',
                dark: 'withOpacity("--background-dark-color")',
                button_primary: 'withOpacity("--button-primary-color")',
                button_secondary: 'withOpacity("--button-secondary-color")',
                button_primary_hover:
                    'withOpacity(\\n                    "--button-primary-hover-color"\\n                )',
                button_secondary_hover:
                    'withOpacity(\\n                    "--button-secondary-hover-color"\\n                )',
            },
            textColor: {
                primary: 'withOpacity("--text-primary-color")',
                secondary: 'withOpacity("--text-secondary-color")',
                primary_dark: 'withOpacity("--text-primary-dark-color")',
                secondary_dark: 'withOpacity("--text-secondary-dark-color")',
            },
            maxWidth: {
                "8xl": "1400px",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            colors: {
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                chart: {
                    1: "hsl(var(--chart-1))",
                    2: "hsl(var(--chart-2))",
                    3: "hsl(var(--chart-3))",
                    4: "hsl(var(--chart-4))",
                    5: "hsl(var(--chart-5))",
                },
                brand: {
                    DEFAULT: "hsl(var(--brand))",
                    foreground: "hsl(var(--brand-foreground))",
                },
                highlight: {
                    DEFAULT: "hsl(var(--highlight))",
                    foreground: "hsl(var(--highlight-foreground))",
                },
            },
        },
    },

    plugins: [
        forms,
        require("tailwindcss-animate"),
        require("tailwind-scrollbar-hide"),
    ],
};

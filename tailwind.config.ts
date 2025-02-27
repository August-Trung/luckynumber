const { heroui } = require("@heroui/react");
import type { Config } from "tailwindcss";

export default {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
		"./node_modules/@heroui/theme/dist/components/(table|checkbox|spacer).js",
	],
	theme: {
		extend: {
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
				dntuText: "#ac2023",
			},
		},
	},
	darkMode: "class",
	plugins: [heroui()],
} satisfies Config;

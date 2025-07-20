import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'background': '#000000',
        'foreground': '#FFFFFF',
      },
       fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'], // Main font is now Poppins
        display: ['var(--font-unbounded)', 'sans-serif'], 
        heading: ['var(--font-genoa)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
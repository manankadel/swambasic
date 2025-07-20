import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

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
        sans: ['var(--font-poppins)', 'sans-serif'],
        display: ['var(--font-unbounded)', 'sans-serif'], 
        heading: ['var(--font-genoa)', 'sans-serif'],
      },
      // NEW: Add text-shadow theme extension
      textShadow: {
        'glow': '0 0 8px rgba(255, 255, 255, 0.5)',
      },
    },
  },
  // NEW: Add the textShadow plugin
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
  ],
}
export default config
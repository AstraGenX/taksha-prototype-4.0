
import type { Config } from "tailwindcss";

export default {
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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Taksha brand colors
				walnut: {
					50: '#faf8f5',
					100: '#f2ede4',
					200: '#e3d5c1',
					300: '#d0b892',
					400: '#bc9862',
					500: '#a67c52',
					600: '#8b5a3c',
					700: '#6d4630',
					800: '#5a3a2a',
					900: '#4d3326',
				},
				teak: {
					50: '#faf9f7',
					100: '#f3f0ea',
					200: '#e6ddd0',
					300: '#d4c4ab',
					400: '#c1a785',
					500: '#a68b6a',
					600: '#8a6f56',
					700: '#725a47',
					800: '#5e4a3c',
					900: '#513f34',
				},
				mahogany: {
					50: '#fdf8f6',
					100: '#f9ede8',
					200: '#f2d8cc',
					300: '#e8bba5',
					400: '#db9376',
					500: '#c8704f',
					600: '#b8573a',
					700: '#9a4530',
					800: '#7e3a2b',
					900: '#683228',
				},
				saffron: {
					50: '#fffbf0',
					100: '#fef3d9',
					200: '#fde4b3',
					300: '#fccf82',
					400: '#f9b34f',
					500: '#f69c2a',
					600: '#e7841f',
					700: '#c0651a',
					800: '#99501c',
					900: '#7c431a',
				},
			},
			fontFamily: {
				'serif': ['Playfair Display', 'serif'],
				'sans': ['Inter', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

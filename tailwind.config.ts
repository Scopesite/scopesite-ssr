import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	screens: {
  		'xs': '375px',
  		'sm': '640px',
  		'md': '768px',
  		'lg': '1024px',
  		'xl': '1280px',
  		'2xl': '1536px',
  	},
  	extend: {
  		colors: {
  			brand: {
  				gold: '#ECB615',
  				'gold-accessible': '#996D00', // WCAG AA on white
  				navy: '#0A1B36',
  				white: '#FFFFFF',
  				orange: '#F68B1E',
  				'orange-accessible': '#B35E00', // WCAG AA on white
  				graphite: '#1E2D50'
  			},
  			territory: {
  				available: '#22C55E', // green
  				pending:   '#3B82F6', // blue
  				claimed:   '#B91C1C', // red (unchanged)
  				inactive:  '#64748B', // slate (unchanged)
  				premium:   '#A855F7', // purple
  				home:      '#F5B700', // gold - exclusively for BA11 home ring
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			// Brand wordmark ONLY. Reserved for the "ScopeSite" / "ScopeSite
  			// Digital Studios" display text (header, footer, mobile menu,
  			// portal nav). Paytone One is hard to read at heading sizes,
  			// so it is not used anywhere else.
  			brand: [
  				'var(--font-paytone)',
  				'Paytone One',
  				'sans-serif'
  			],
  			// All headings (H1-H6, card titles, modal titles, step headers,
  			// section headings, etc.) — Inter at weight 900 for heavy,
  			// readable display. `.font-headline` defaults to weight 900 via
  			// the globals.css rule so existing call sites don't need to add
  			// `font-black` manually.
  			headline: [
  				'var(--font-inter)',
  				'Inter',
  				'sans-serif'
  			],
  			body: [
  				'var(--font-inter)',
  				'Inter',
  				'sans-serif'
  			]
  		},
		fontSize: {
			display: [
				'6.25rem',
				{
					lineHeight: '1.1',
					letterSpacing: '-0.02em'
				}
			],
  			h1: [
  				'3rem',
  				{
  					lineHeight: '1.2',
  					letterSpacing: '-0.01em'
  				}
  			],
  			h2: [
  				'2.25rem',
  				{
  					lineHeight: '1.25'
  				}
  			],
  			h3: [
  				'1.75rem',
  				{
  					lineHeight: '1.3'
  				}
  			],
  			h4: [
  				'1.25rem',
  				{
  					lineHeight: '1.4'
  				}
  			],
			'body-lg': [
				'1.5625rem',
				{
					lineHeight: '1.7'
				}
			],
  			body: [
  				'1rem',
  				{
  					lineHeight: '1.7'
  				}
  			],
  			'body-sm': [
  				'0.875rem',
  				{
  					lineHeight: '1.6'
  				}
  			],
  			caption: [
  				'0.75rem',
  				{
  					lineHeight: '1.5'
  				}
  			]
  		},
  		spacing: {
  			xxs: '0.25rem',
  			xs: '0.5rem',
  			s: '1rem',
  			m: '1.5rem',
  			l: '2rem',
  			xl: '3rem',
  			xxl: '4rem',
  			xxxl: '6rem',
  			section: '5rem',
  			'section-mobile': '2.5rem'
  		},
  		borderRadius: {
  			DEFAULT: '1rem',
  			sm: 'calc(var(--radius) - 4px)',
  			lg: 'var(--radius)',
  			xl: '1.5rem',
  			pill: '999px',
  			none: '0',
  			md: 'calc(var(--radius) - 2px)'
  		},
  		boxShadow: {
  			card: '0 2px 8px rgba(10, 27, 54, 0.1)',
  			'card-hover': '0 6px 16px rgba(10, 27, 54, 0.15)',
  			button: '0 4px 12px rgba(236, 182, 21, 0.3)',
  			'button-hover': '0 6px 16px rgba(236, 182, 21, 0.4)'
  		},
  		transitionDuration: {
  			DEFAULT: '200ms',
  			fast: '150ms',
  			slow: '300ms',
  			'400': '400ms'
  		},
  		maxWidth: {
  			content: '1200px',
  			narrow: '800px',
  			wide: '1400px'
  		},
  		keyframes: {
  			'fade-in': {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			'slide-up': {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			'slide-down': {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(-20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			'slide-in-right': {
  				'0%': {
  					opacity: '0',
  					transform: 'translateX(40px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateX(0)'
  				}
  			}
  		},
  		animation: {
  			'fade-in': 'fade-in 0.3s ease-out',
  			'slide-up': 'slide-up 0.4s ease-out',
  			'slide-down': 'slide-down 0.4s ease-out',
  			'slide-in-right': 'slide-in-right 0.6s ease-out 0.2s both'
  		}
  	}
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
}

export default config

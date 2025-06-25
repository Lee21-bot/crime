import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--bg-primary) / <alpha-value>)",
        foreground: "rgb(var(--text-primary) / <alpha-value>)",
        "bg-primary": "rgb(var(--bg-primary) / <alpha-value>)",
        "bg-secondary": "rgb(var(--bg-secondary) / <alpha-value>)",
        "bg-tertiary": "rgb(var(--bg-tertiary) / <alpha-value>)",
        "accent-yellow": "rgb(var(--accent-yellow) / <alpha-value>)",
        "accent-red": "rgb(var(--accent-red) / <alpha-value>)",
        "accent-orange": "rgb(var(--accent-orange) / <alpha-value>)",
        "text-primary": "rgb(var(--text-primary) / <alpha-value>)",
        "text-secondary": "rgb(var(--text-secondary) / <alpha-value>)",
        "text-muted": "rgb(var(--text-muted) / <alpha-value>)",
        "border-primary": "rgb(var(--border-primary) / <alpha-value>)",
        "member-gold": "rgb(var(--member-gold) / <alpha-value>)",
        "member-silver": "rgb(var(--member-silver) / <alpha-value>)",
      },
      fontFamily: {
        serif: ['var(--font-crimson-pro)', 'Crimson Pro', 'serif'],
        display: ['var(--font-crimson-pro)', 'Crimson Pro', 'serif'],
        body: ['var(--font-crimson-pro)', 'Crimson Pro', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        fraktur: ['UnifrakturMaguntia', 'cursive'],
        mono: ['Roboto Mono', 'monospace']
      },
      animation: {
        'floating-tape': 'floatingTape 3s ease-in-out infinite',
        'message-slide-in': 'messageSlideIn 0.3s ease-out',
        'scroll-tape': 'scrollTape 25s linear infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'evidence-glow': 'evidenceGlow 2s ease-in-out infinite',
      },
      keyframes: {
        floatingTape: {
          '0%, 100%': { transform: 'translateX(0) rotate(-2deg)' },
          '50%': { transform: 'translateX(15px) rotate(2deg)' }
        },
        messageSlideIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scrollTape: {
          '0%': { transform: 'translateY(-50%) translateX(100vw)' },
          '100%': { transform: 'translateY(-50%) translateX(-100%)' }
        },
        shimmer: {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' }
        },
        evidenceGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(251, 146, 60, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(251, 146, 60, 0.8), 0 0 30px rgba(251, 146, 60, 0.6)' }
        }
      }
    },
  },
  plugins: [],
};

export default config; 
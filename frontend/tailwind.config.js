/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0A6B63',
        'background-light': '#F4F7F9',
        'background-dark': '#070C12',
        'surface-dark': '#0E141C',
        'surface-light': '#FFFFFF',
        'border-dark': '#1A2430',
        ink: {
          DEFAULT: '#07131C',
          soft: '#243447',
          mute: '#5B6B7C',
        },
        bg: {
          deep: '#070C12',
          panel: 'rgba(14, 20, 28, 0.94)',
          input: '#121A24',
          card: 'rgba(14, 20, 28, 0.72)',
        },
        accent: {
          gold: '#0A6B63',
          'gold-light': '#12A394',
          cyan: '#0E7490',
          blue: '#16324F',
          danger: '#DC2626',
          success: '#059669',
          purple: '#475569',
        },
        glass: {
          border: 'rgba(10, 107, 99, 0.18)',
          'border-light': 'rgba(10, 107, 99, 0.1)',
        }
      },
      fontFamily: {
        legal: ['Instrument Serif', 'Georgia', 'serif'],
        tech: ['Manrope', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        display: ['Instrument Serif', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-gold': 'linear-gradient(135deg, #0A6B63 0%, #0D8A7F 100%)',
        'gradient-blue': 'linear-gradient(135deg, #16324F 0%, #07131C 100%)',
        'gradient-hero': 'radial-gradient(ellipse at 70% 40%, rgba(10,107,99,0.16) 0%, transparent 55%)',
        'gradient-mesh': 'radial-gradient(at 15% 20%, rgba(10,107,99,0.08) 0%, transparent 45%), radial-gradient(at 85% 10%, rgba(22,50,79,0.1) 0%, transparent 40%)',
      },
      boxShadow: {
        'glow-gold': '0 10px 28px rgba(10, 107, 99, 0.2)',
        'glow-blue': '0 10px 28px rgba(22, 50, 79, 0.16)',
        'glow-cyan': '0 8px 22px rgba(14, 116, 144, 0.14)',
        'glass': '0 16px 48px rgba(7, 12, 18, 0.14)',
        'glass-hover': '0 20px 52px rgba(7, 12, 18, 0.18)',
        'input': 'inset 0 1px 2px rgba(0,0,0,0.06)',
        'soft': '0 1px 2px rgba(7, 19, 28, 0.04), 0 10px 28px rgba(7, 19, 28, 0.06)',
        'lift': '0 14px 36px rgba(7, 19, 28, 0.12)',
      },
      animation: {
        'red-pulse': 'red-pulse 2s infinite',
        'scan': 'scan 3s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'slide-in-right': 'slideInRight 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 2s infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'spin-slow': 'spin 10s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave': 'wave 1.2s ease-in-out infinite',
        'bounce-dot': 'bounceDot 1.4s infinite ease-in-out both',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'letter-appear': 'letterAppear 0.5s ease-out forwards',
      },
      keyframes: {
        'red-pulse': {
          '0%, 100%': { boxShadow: 'inset 0 0 0 rgba(255, 0, 0, 0)' },
          '50%': { boxShadow: 'inset 0 0 40px rgba(220, 38, 38, 0.25)' },
        },
        scan: {
          '0%': { top: '0%' },
          '50%': { top: '100%' },
          '100%': { top: '0%' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '1' },
        },
        bounceDot: {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        letterAppear: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.8)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        wave: {
          '0%, 100%': { height: '10%' },
          '50%': { height: '60%' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

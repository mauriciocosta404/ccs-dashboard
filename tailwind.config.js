// tailwind.config.js
module.exports = {
    theme: {
      extend: {
        animation: {
          'fade-in': 'fadeIn 0.5s ease-out',
          'pulse-slow': 'pulse 1.5s infinite',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0', transform: 'translateY(20px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          pulse: {
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.1)' },
          }
        }
      }
    }
  }
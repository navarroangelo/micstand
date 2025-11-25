/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'strong': '0 8px 24px rgba(0, 0, 0, 0.16)',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        disasterResponse: {
          // Primary colors - Using the dark navy and blue-grey
          "primary": "#273043",        // Dark navy - main brand color
          "primary-content": "#EEF0F2", // Light grey text on primary

          // Secondary colors - Using the blue-grey
          "secondary": "#9197AE",      // Blue-grey - secondary actions
          "secondary-content": "#273043", // Dark text on secondary

          // Accent colors - Using the red tones
          "accent": "#F02D3A",         // Bright red - attention/highlights
          "accent-content": "#EFF6EE",  // Light cream on accent

          // Neutral colors
          "neutral": "#273043",        // Dark navy for neutral elements
          "neutral-content": "#EEF0F2", // Light text on neutral

          // Base colors - backgrounds
          "base-100": "#EEF0F2",       // Light grey - main background
          "base-200": "#EFF6EE",       // Light cream - secondary background
          "base-300": "#9197AE",       // Blue-grey - borders/dividers
          "base-content": "#141414",   // Almost black - main text

          // State colors
          "info": "#273043",           // Dark navy for info
          "success": "#273043",        // Using navy instead of green for consistency
          "warning": "#F02D3A",        // Bright red for warnings
          "error": "#DD0426",          // Deep red for errors

          // Border radius - minimal, modern
          "--rounded-box": "0.5rem",
          "--rounded-btn": "0.375rem",
          "--rounded-badge": "0.25rem",

          // Animation speed - smooth and modern
          "--animation-btn": "0.2s",
          "--animation-input": "0.2s",

          // Border width - subtle
          "--border-btn": "1px",

          // Focus ring
          "--tab-border": "1px",
          "--tab-radius": "0.375rem",
        },
      },
    ],
    base: true,
    styled: true,
    utils: true,
    logs: false,
  },
}

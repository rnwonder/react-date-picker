/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    // preflight: false,
    // container: false,
  },
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: "#18181B",
        "primary-focus": "#e0e0e0",
        "eerie-black": "#1b1b1b",
        "dreamless-sleep": "#111111",
        "black-tie": "#474747",
        "dark-time": "#8f8f8f",
      },
      transformOrigin: {
        "center-bottom": "center bottom ",
      },
      height: {
        time: "20px",
        "time-2": "36px",
      },
      width: {
        time: "20px",
        "time-2": "36px",
      },
      lineHeight: {
        time: "20px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
    screens: {
      smallMobile: {
        max: "320px",
      },
      mobile: {
        max: "640px",
      },
      breakTwoCalendar: {
        max: "566px",
      },
      aboveBreakTwoCalendar: {
        min: "567px",
      },
      tablet: "640px",
      laptop: "1024px",
      desktop: "1280px",
    },
  },
  daisyui: {
    themes: false,
  },
  prefix: "rn-",
  plugins: [require("tailwindcss-animate"), require("daisyui")],
};

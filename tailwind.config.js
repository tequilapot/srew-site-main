/** @type {import('tailwindcss').Config} */
/*
 * Tailwind v3 config, written as ESM because package.json has "type": "module".
 * This site does not compile Tailwind. Bootstrap and css/tokens.css are the
 * runtime. The values below match css/tokens.css. Prefer var(--token) in CSS.
 */
export default {
  content: [
    "./index.html",
    "./*.html",
    "./src/**/*.{js,ts,jsx,tsx,html,vue,svelte}",
    "./app/**/*.{js,ts,jsx,tsx,html,vue,svelte}",
  ],
  theme: {
    extend: {
      colors: {
        air: {
          white: "#ffffff",
          background: "#ffffff",
          foreground: "#202020",
          black: "#000000",
          900: "#0c0c0c",
          800: "#222222",
          gray: {
            10: "#f4f4f4",
            25: "#e9e9e9",
            100: "#bdbdbd",
            200: "#a7a7a7",
            300: "#919191",
            400: "#7a7a7a",
            600: "#4e4e4e",
            700: "#383838",
          },
          inactive: "#767676",
          mint: "#66dba4",
          "mint-bright": "#39dda2",
          link: "#2020e0",
        },
      },
      fontFamily: {
        sans: [
          "Neue Haas Grotesk Display Pro",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "Roboto Mono",
          "SF Mono",
          "Cascadia Mono",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
      fontSize: {
        body: ["16px", { lineHeight: "1.6" }],
        "body-lg": ["18px", { lineHeight: "1.6" }],
        eyebrow: ["13px", { lineHeight: "1.4", letterSpacing: "0.03em" }],
        "card-title": ["48px", { lineHeight: "1.08", letterSpacing: "-0.04em" }],
        "section-title": ["62px", { lineHeight: "1.04", letterSpacing: "-0.045em" }],
      },
      maxWidth: {
        site: "1280px",
      },
      spacing: {
        header: "80px",
        gutter: "24px",
        "gutter-mobile": "20px",
        section: "96px",
        "section-mobile": "64px",
      },
      borderRadius: {
        air: "0px",
        none: "0px",
      },
      borderWidth: {
        hairline: "1px",
      },
      backgroundImage: {
        "case-scrim": "linear-gradient(180deg, transparent 30%, rgb(0 0 0 / 72%) 100%)",
        "hero-scrim": "linear-gradient(90deg, rgb(0 0 0 / 42%), rgb(0 0 0 / 8%))",
      },
    },
  },
  plugins: [],
};

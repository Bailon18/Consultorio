/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        bone: "#f6f2ea",
        cream: "#fbf8f2",
        sand: "#ebe3d6",
        sage: {
          DEFAULT: "#3d5f57",
          deep: "#2f4b45",
          mist: "#d5e0dc",
        },
        clay: {
          DEFAULT: "#c77758",
          soft: "#efd2c4",
        },
        ink: "#1c1a17",
        mute: "#5f5b55",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Outfit", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 50px rgba(28, 26, 23, 0.08)",
      },
      maxWidth: {
        site: "74rem",
      },
    },
  },
  plugins: [],
};

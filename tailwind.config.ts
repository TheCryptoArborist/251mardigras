import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        parade: {
          purple: "#34125f",
          purpleDark: "#21083f",
          purpleSoft: "#f2ecfb",
          green: "#167c4a",
          greenSoft: "#eaf7ef",
          gold: "#d69b16",
          goldSoft: "#fff4cf",
          ink: "#171321",
          muted: "#625a70",
          line: "#ded8e8"
        }
      },
      boxShadow: {
        civic: "0 12px 30px rgba(33, 8, 63, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;

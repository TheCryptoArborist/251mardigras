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
          purpleDeep: "#17042f",
          purpleSoft: "#f2ecfb",
          purpleMist: "#faf7ff",
          gold: "#d69b16",
          goldBright: "#ffc928",
          goldSoft: "#fff4cf",
          cream: "#fffaf0",
          ink: "#171321",
          muted: "#625a70",
          line: "#ded8e8"
        }
      },
      boxShadow: {
        civic: "0 12px 30px rgba(33, 8, 63, 0.12)",
        glow: "0 18px 55px rgba(214, 155, 22, 0.22)",
        card: "0 18px 45px rgba(33, 8, 63, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;

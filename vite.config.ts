import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import terser from "@rollup/plugin-terser";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        dateMath: resolve(__dirname, "src/dateMath.ts"),
        utilities: resolve(__dirname, "src/utilities.ts"),
        timePicker: resolve(__dirname, "src/timePicker.ts"),
        monthSelector: resolve(__dirname, "src/monthSelector.ts"),
        popover: resolve(__dirname, "src/popover.ts"),
        yearSelector: resolve(__dirname, "src/yearSelector.ts"),
        calendar: resolve(__dirname, "src/calendar.ts"),
        calendarArea: resolve(__dirname, "src/calendarArea.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime"],
      plugins: [terser()],
    },
  },
  resolve: {
    mainFields: ["module", "main"],
    alias: {
      "@rnwonder/react-date-picker": resolve(__dirname, "src"),
    },
  },
});

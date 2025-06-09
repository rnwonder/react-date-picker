import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import { extname, relative } from "path";
import { fileURLToPath } from "node:url";
import { glob } from "glob";

export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    dts({
      include: ["src"],
      exclude: ["src/**/*.test.tsx", "src/**/*.stories.tsx"],
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime", "react-dom"],
      input: Object.fromEntries(
        glob.sync("src/**/*.{ts,tsx}").map((file) => [
          // The name of the entry point
          // src/index.ts becomes index
          // src/utils/foo.ts becomes utils/foo
          relative("src", file.slice(0, file.length - extname(file).length)),
          // The absolute path to the entry file
          fileURLToPath(new URL(file, import.meta.url)),
        ]),
      ),
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
      },
    },
    cssCodeSplit: true,
    minify: "terser",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});

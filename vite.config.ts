import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import fs from 'fs'
import { glob } from 'glob'
import path from 'path'

// Custom plugin to preserve "use client" directives
const preserveUseClient = () => {
  const hasUseClientFiles = new Set<string>();
  
  return {
    name: 'preserve-use-client',
    buildStart() {
      // Scan for files with "use client" during build start
      const files = glob.sync('src/**/*.{ts,tsx}', { cwd: process.cwd() });
      
      files.forEach((file: string) => {
        try {
          const fullPath = path.resolve(file);
          const content = fs.readFileSync(fullPath, 'utf-8');
          if (content.includes('"use client"') || content.includes("'use client'")) {
            hasUseClientFiles.add(fullPath);
          }
        } catch {
          // ignore
        }
      });
    },
    renderChunk(code: string, chunk: any) {
      // Check if this chunk contains any modules that had "use client"
      const hasUseClient = chunk.moduleIds?.some((id: string) => 
        hasUseClientFiles.has(id)
      );
      
      if (hasUseClient && !code.startsWith('"use client"')) {
        return '"use client";\n' + code;
      }
      
      return code;
    }
  };
};

export default defineConfig({
  plugins: [
    react(),
    preserveUseClient(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*'],
      exclude: ['src/**/*.test.*', 'src/**/*.spec.*']
    })
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        timePicker: resolve(__dirname, 'src/timePicker.ts'),
        rnPortal: resolve(__dirname, 'src/rnPortal.ts'),
        monthSelector: resolve(__dirname, 'src/monthSelector.ts'),
        calendarArea: resolve(__dirname, 'src/calendarArea.ts'),
        popover: resolve(__dirname, 'src/popover.ts'),
        yearSelector: resolve(__dirname, 'src/yearSelector.ts'),
        calendar: resolve(__dirname, 'src/calendar.ts'),
        utilities: resolve(__dirname, 'src/utilities.ts'),
        dateMath: resolve(__dirname, 'src/dateMath.ts'),
      },
      formats: ['es']
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        /^react\/.*/,
        /^react-dom\/.*/
      ],
      output: {
        preserveModules: false,
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime'
        },
        interop: 'compat'
      }
    }
  },
  esbuild: {
    jsx: 'automatic'
  }
})
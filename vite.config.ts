import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      // Entry point of your library
      entry: path.resolve(__dirname, 'src/main.ts'), 
      name: 'render-lib',
      fileName: (format) => `render-lib.${format}.js`,
    },
    rollupOptions: {
      // Ensure external dependencies are not bundled into the library
      external: ['three'],
      output: {
        globals: {
          // For example, you can map external dependencies here
          // 'vue': 'Vue'
        }
      }
    }
  }
});

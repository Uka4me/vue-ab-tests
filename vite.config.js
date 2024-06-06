import path from 'path';
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from 'vite-plugin-dts'

console.log(path.resolve(__dirname, 'src/index.js'));
export default defineConfig({
    plugins: [
        vue(),
        dts({
            insertTypesEntry: true,
        })
    ],
    test: {
        environment: 'jsdom'
    },
    build: {
        lib: {
          entry: path.resolve(__dirname, 'src/index.ts'),
          formats: ['es'],
          fileName: 'index'
        },
        rollupOptions: {
          external: ['vue'],
          output: {
            globals: {
              vue: 'Vue'
            }
          }
        }
    }
});
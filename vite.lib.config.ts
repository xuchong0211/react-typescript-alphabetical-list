import { defineConfig } from "vite";
import typescript from "@rollup/plugin-typescript";
// import nodeResolve from "@rollup/plugin-commonjs";
// import commonjs from "@rollup/plugin-node-resolve";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: "esbuild",
    lib: {
      entry: resolve(__dirname, "./src/lib/main.ts"),
      name: "myLib",
      formats: ["es"],
      // formats: [],
      fileName: (format) => `MyLib.${format}.jsx`,
    },
    outDir: "./astro-project/src/components/lib",
    watch: {},
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["react"],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        // globals: {
        //   react: "React",
        // },
      },
    },
  },
  plugins: [typescript()],
});

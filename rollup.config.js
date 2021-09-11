import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-node-resolve";
import { resolve } from "path";

export default {
  input: resolve(__dirname, "./src/lib/main.ts"),
  output: {
    file: "./src/astro-project/src/components/lib",
    format: "cjs",
  },
  plugins: [
    nodeResolve(),
    typescript(),
    babel({
      exclude: "node_modules/**",
    }),
  ],
  external: [/node_modules/],
};

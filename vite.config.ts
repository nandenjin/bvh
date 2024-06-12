import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "modules",
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "bvh",
      fileName: "bvh",
    },
  },
});

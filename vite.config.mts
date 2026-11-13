import { defineConfig } from "vite";
import zaloMiniApp from "zmp-vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";

// Render Static Site builds a normal web bundle without requiring ZMP CLI.
// Zalo deployment continues to use the ZMP plugin and its existing config.
export default ({ mode }: { mode: string }) => {
  const isRenderBuild = mode === "render";

  return defineConfig({
    root: isRenderBuild ? "." : "./src",
    base: isRenderBuild ? "/" : "",
    plugins: [
      ...(isRenderBuild ? [] : [zaloMiniApp()]),
      react(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
    },
  });
};

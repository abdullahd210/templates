import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.ts", "prisma/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Repositories/services import "server-only" to fence them out of
      // client bundles at build time; its default export always throws
      // outside Next.js's "react-server" resolution condition, so under
      // plain Node/Vitest it's aliased to the package's own no-op stub.
      "server-only": path.resolve(__dirname, "./node_modules/server-only/empty.js"),
    },
  },
});

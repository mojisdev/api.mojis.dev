// @ts-check
import { luxass } from "@luxass/eslint-config";

export default luxass({
  formatters: true,
}, {
  ignores: [
    "worker-configuration.d.ts",
  ],
}, {
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [`hono/cache`],
            message: "Use our own cache middleware instead",
          },
        ],
      },
    ],
  },
});

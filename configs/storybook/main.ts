import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/nextjs-vite";
import type { LogOptions, Logger } from "vite";

const IGNORED_VITE_WARNING_SNIPPETS = [
  'Module level directives cause errors when bundled, "use client" in',
  "Error when using sourcemap for reporting an error: Can't resolve original location of error.",
] as const;
const projectRoot = fileURLToPath(new URL("../..", import.meta.url));

function shouldIgnoreViteWarning(message: string): boolean {
  return IGNORED_VITE_WARNING_SNIPPETS.some((snippet) => message.includes(snippet));
}

async function createStorybookViteLogger(): Promise<Logger> {
  const { createLogger } = await import("vite");
  const logger = createLogger();
  const warn = logger.warn.bind(logger);
  const warnOnce = logger.warnOnce.bind(logger);

  // Storybook's browser-only Vite bundle strips Next client directives,
  // which is expected here and otherwise floods the build log with noise.
  const filteredWarn = (message: string, options?: LogOptions) => {
    if (shouldIgnoreViteWarning(message)) {
      return;
    }

    warn(message, options);
  };

  logger.warn = filteredWarn;
  logger.warnOnce = (message, options) => {
    if (shouldIgnoreViteWarning(message)) {
      return;
    }

    warnOnce(message, options);
  };

  return logger;
}

function createStorybookTestAliases() {
  if (!process.env.VITEST) {
    return [];
  }

  return [
    {
      find: /^@\/shared\/lib$/,
      replacement: resolve(projectRoot, "src/testing/mocks/shared-lib.ts"),
    },
    {
      find: /^@\/shared\/lib\/fonts$/,
      replacement: resolve(projectRoot, "src/testing/mocks/fonts.ts"),
    },
    {
      find: /\/src\/shared\/lib\/fonts\.ts$/,
      replacement: resolve(projectRoot, "src/testing/mocks/fonts.ts"),
    },
  ];
}

const config: StorybookConfig = {
  stories: ["../../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-vitest"],
  core: {
    disableTelemetry: true,
  },
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  staticDirs: ["../../public"],
  async viteFinal(config) {
    const { mergeConfig } = await import("vite");

    return mergeConfig(config, {
      build: {
        chunkSizeWarningLimit: 1500,
      },
      cacheDir: resolve(projectRoot, ".cache/storybook/vite"),
      customLogger: await createStorybookViteLogger(),
      resolve: {
        alias: createStorybookTestAliases(),
      },
    });
  },
};

export default config;

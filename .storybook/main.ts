import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  typescript: { reactDocgen: "react-docgen-typescript" },

  stories: ["../stories/**/*.stories.@(ts|tsx|mdx)"],

  addons: ["@storybook/addon-a11y", "@chromatic-com/storybook", "@storybook/addon-docs"],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  viteFinal: async (config) => {
    const tailwindcss = (await import("@tailwindcss/vite")).default;
    // The stories import the package by name; point it at the source (the same path as tsconfig `paths`).
    return mergeConfig(config, {
      plugins: [tailwindcss()],
      resolve: {
        alias: {
          "@volo-uti/volo-web-admin-ui": fileURLToPath(new URL("../src/index.ts", import.meta.url)),
        },
      },
    });
  },
};

export default config;

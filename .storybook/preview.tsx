import React from "react";
import type { Preview, Decorator } from "@storybook/react-vite";
import { Title, Description, Primary, Controls } from "@storybook/addon-docs/blocks";
import { ThemeProvider } from "@volo-uti/volo-web-ui";
import "./global.css";

const withThemeProvider: Decorator = (Story, context) => {
  const colorScheme = (context.globals.colorScheme || "light") as "light" | "dark";

  // Sync the Storybook toolbar choice to localStorage
  // so that ThemeProvider uses the toolbar value
  if (typeof window !== "undefined") {
    localStorage.setItem("volo-color-scheme", colorScheme);
  }

  return (
    <ThemeProvider key={colorScheme} defaultColorScheme={colorScheme}>
      <div
        className={colorScheme === "dark" ? "dark" : ""}
        data-v-color-scheme={colorScheme}
        style={{
          fontFamily: "var(--v-font-sans)",
          backgroundColor: "var(--v-background)",
          color: "var(--v-foreground)",
          padding: "1rem",
        }}
      >
        <Story />
      </div>
    </ThemeProvider>
  );
};

const preview: Preview = {
  tags: ["autodocs"],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      page: () => (
        <>
          <Title />
          <Description />
          <Primary />
          <Controls />
        </>
      ),
    },
    options: {
      storySort: {
        order: [
          "Components",
          ["Admin", ["VAdminShell", "VSidebar", "VPageHeader", "VListToolbar", "VDataTable"]],
        ],
      },
    },
  },
  decorators: [withThemeProvider],
  globalTypes: {
    colorScheme: {
      description: "Color scheme",
      defaultValue: "light",
      toolbar: {
        title: "Color Scheme",
        icon: "mirror",
        items: ["light", "dark"],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;

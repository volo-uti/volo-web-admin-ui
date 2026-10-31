import React from "react";
import { VDivider } from "@volo-uti/volo-web-ui";

export interface StorybookPageLayoutProps {
  title: string;
  description?: string;
  childrenSpacing?: number;
  children: React.ReactNode;
}

/**
 * Page layout with a title and description.
 *
 * - Padding: vertical 64px, horizontal 32px
 * - Title: headlineLarge (32px / 700 / 1.25)
 * - Description: bodyLarge (16px / 400 / 1.5 / ls 0.5px)
 * - Divider: 1px solid border, 16px gap above
 * - childrenSpacing: default 24px between children
 */
export function StorybookPageLayout({
  title,
  description,
  childrenSpacing = 24,
  children,
}: StorybookPageLayoutProps) {
  // Flatten children into an array so we can insert spacing between them
  const childArray = React.Children.toArray(children);

  return (
    <div
      style={{
        padding: "64px 32px",
        color: "var(--v-foreground)",
        backgroundColor: "var(--v-background)",
        fontFamily: 'var(--v-font-sans, "Pretendard Variable", sans-serif)',
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 700,
            lineHeight: 1.25,
            color: "var(--v-foreground)",
            margin: 0,
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            style={{
              marginTop: "16px",
              marginBottom: 0,
              fontSize: "16px",
              fontWeight: 400,
              letterSpacing: "0.5px",
              lineHeight: 1.5,
              color: "var(--v-muted-foreground)",
            }}
          >
            {description}
          </p>
        )}
        <VDivider style={{ marginTop: "16px" }} />
      </div>

      {/* Children with childrenSpacing gaps */}
      <div style={{ height: `${childrenSpacing}px` }} />
      {childArray.map((child, i) => (
        <React.Fragment key={i}>
          {child}
          {i < childArray.length - 1 && <div style={{ height: `${childrenSpacing}px` }} />}
        </React.Fragment>
      ))}
    </div>
  );
}

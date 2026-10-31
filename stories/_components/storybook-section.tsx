import React from "react";

// ─── Section ───

export interface StorybookSectionProps {
  title: string;
  description?: string;
  /** Spacing between title area and children, and between children (default 16). */
  spacing?: number;
  children: React.ReactNode;
}

/**
 * Section with a title, description and spaced children.
 *
 * - Title: titleMedium + bold (16px / 700 / ls 0.15px / lh 1.5)
 * - Description: bodySmall (12px / 400 / ls 0.4px / lh 1.33)
 * - spacing: 16px (default) between title area and children, and between children
 */
export function StorybookSection({
  title,
  description,
  spacing = 16,
  children,
}: StorybookSectionProps) {
  const childArray = React.Children.toArray(children);

  return (
    <section style={{ display: "flex", flexDirection: "column" }}>
      {/* Title */}
      <h2
        style={{
          margin: 0,
          fontSize: "16px",
          fontWeight: 700,
          letterSpacing: "0.15px",
          lineHeight: 1.5,
          color: "var(--v-foreground)",
        }}
      >
        {title}
      </h2>
      {/* Description */}
      {description && (
        <p
          style={{
            margin: 0,
            marginTop: "8px",
            fontSize: "12px",
            fontWeight: 400,
            letterSpacing: "0.4px",
            lineHeight: 1.33,
            color: "var(--v-muted-foreground)",
          }}
        >
          {description}
        </p>
      )}
      {/* Gap before children */}
      <div style={{ height: `${spacing}px` }} />
      {/* Children with spacing gaps */}
      {childArray.map((child, i) => (
        <React.Fragment key={i}>
          {child}
          {i < childArray.length - 1 && <div style={{ height: `${spacing}px` }} />}
        </React.Fragment>
      ))}
    </section>
  );
}

// ─── Subsection ───

export interface StorybookSubsectionProps {
  title: string;
  labels?: string[];
  children: React.ReactNode;
}

export function StorybookSubsection({ title, labels, children }: StorybookSubsectionProps) {
  return (
    <div className="space-y-4">
      {/* Header: title = [labels] */}
      <div className="flex items-center gap-3 h-7 overflow-x-auto">
        <span className="text-sm font-bold text-[var(--v-foreground)] shrink-0">
          {title}
          {labels?.length ? " =" : ""}
        </span>
        {labels?.map((label) => (
          <code
            key={label}
            className="text-xs font-bold font-mono bg-[var(--v-muted)] text-[var(--v-foreground)] px-2 py-1 rounded shrink-0"
          >
            {label}
          </code>
        ))}
      </div>

      {/* Content area with hatch background */}
      <div
        className="relative rounded-lg border border-[var(--v-border)]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 8px,
            color-mix(in srgb, var(--v-border) 30%, transparent) 8px,
            color-mix(in srgb, var(--v-border) 30%, transparent) 9px
          )`,
          backgroundColor: "var(--v-card)",
        }}
      >
        <div className="p-5 flex flex-wrap items-center gap-3">{children}</div>
      </div>
    </div>
  );
}

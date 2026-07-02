/**
 * Wrapped MDXComponents map.
 *
 * WHY: adds a `table` mapping on top of Docusaurus's stock component map.
 * Docusaurus's own MDXComponents/index.js has no `table` entry at all — raw
 * markdown tables render as a bare `<table>` with no accessibility
 * enhancement. See MDXComponents/Table.tsx for why that needs a `tabindex`.
 */
import React, { type ReactNode } from "react";
import MDXComponents from "@theme-original/MDXComponents";
// Relative import, not the `@theme/...` alias: this component is NEW (no
// upstream @docusaurus/theme-classic module of the same name exists for
// `tsc` to resolve the alias against — theme-classic ships no
// MDXComponents/Table at all), unlike a genuine swizzle-override of an
// existing theme file.
import MDXTable from "./Table";

export default {
  ...MDXComponents,
  table: (props: ComponentPropsFor<"table">): ReactNode => <MDXTable {...props} />,
};

type ComponentPropsFor<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T];

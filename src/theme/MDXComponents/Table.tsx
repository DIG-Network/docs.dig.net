/**
 * Accessible wrapper for markdown `<table>` elements.
 *
 * WHY: Infima's base table CSS sets `table { display: block; overflow: auto; }`
 * — the table itself becomes its own horizontal-scroll container whenever it's
 * wider than its column (every wide reference table in these docs, e.g. the
 * onion-routing "who-knows-what" table). A scrollable element with no native
 * keyboard focus target fails WCAG 2.1.1 (keyboard) — verified by axe-core's
 * `scrollable-region-focusable` rule on /docs/protocol/onion-routing. Adding
 * `tabindex="0"` makes the table itself a Tab stop so keyboard/AT users can
 * focus it and then scroll with arrow keys, matching the standard accessible
 * wide-table pattern. `role="region"` + `aria-label` (derived from the
 * table's own caption/first header row when present) gives AT users a
 * meaningful landmark instead of an anonymous scrollable blob.
 */
import React, { type ComponentProps, type ReactNode } from "react";

export default function Table(props: ComponentProps<"table">): ReactNode {
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- intentional: makes the table's own overflow:auto scroll region keyboard-reachable.
    <table {...props} tabIndex={0} />
  );
}

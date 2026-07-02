import React from 'react';
import clsx from 'clsx';

import type {Props} from '@theme/NavbarItem/HtmlNavbarItem';

// Swizzled from @docusaurus/theme-classic (eject) to fix a real WCAG 2.2 AA
// violation (axe rule `list`, "Ensure that lists are structured correctly"):
// upstream always renders a `<div>` here unless `isDropdownItem`, but on
// mobile this item is a DIRECT CHILD of the sidebar's `<ul class="menu__list">`
// (see MobileSidebar/PrimaryMenu) — a `<div>` there breaks list semantics for
// screen readers (an AT-announced list must contain only `<li>` children).
// Render `<li>` whenever this item lands inside a `<ul>` (mobile OR a
// dropdown submenu), matching the real DOM context; keep `<div>` only for
// the desktop inline navbar, which is a flex row of `navbar__item`s, not a
// list. Verified against tests/e2e/mobile-nav.spec.ts (axe zero violations
// with the mobile sidebar open).
export default function HtmlNavbarItem({
  value,
  className,
  mobile = false,
  isDropdownItem = false,
}: Props): JSX.Element {
  const Comp = mobile || isDropdownItem ? 'li' : 'div';
  return (
    <Comp
      className={clsx(
        {
          navbar__item: !mobile && !isDropdownItem,
          'menu__list-item': mobile,
        },
        className,
      )}
      dangerouslySetInnerHTML={{__html: value}}
    />
  );
}

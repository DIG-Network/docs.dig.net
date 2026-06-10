import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "DigStore",
  tagline:
    "A Git-shaped, encrypted, content-addressable store that compiles to a single self-defending WebAssembly module.",
  favicon: "img/favicon.png",

  url: "https://docs.dig.net",
  baseUrl: process.env.BASE_URL || "/",

  organizationName: "DIG-Network",
  projectName: "docs.dig.net",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "docs",
          editUrl: "https://github.com/DIG-Network/docs.dig.net/tree/main/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: "dark",
      respectPrefersColorScheme: true,
    },
    image: "img/brand/Wordmark-Stacked-Glow.png",
    navbar: {
      title: "DigStore",
      logo: {
        alt: "DigStore — by DIG Network",
        src: "img/brand/Wordmark-Black.svg",
        srcDark: "img/brand/Wordmark-white.svg",
        href: "/",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Docs",
        },
        { to: "/docs/format/overview", label: "Format", position: "left" },
        { to: "/docs/cli/quickstart", label: "CLI", position: "left" },
        {
          href: "https://github.com/DIG-Network/digstore",
          position: "right",
          className: "navbar-github-link",
          "aria-label": "GitHub repository",
        },
      ],
    },
    footer: {
      style: "dark",
      logo: {
        alt: "DigStore — by DIG Network",
        src: "img/brand/wordmark-with-slogan-white.svg",
        href: "https://dig.net",
        width: 200,
      },
      links: [
        {
          title: "Documentation",
          items: [
            { label: "What is DigStore?", to: "/docs/" },
            { label: "Format Overview", to: "/docs/format/overview" },
            { label: "Quick start", to: "/docs/cli/quickstart" },
            { label: "Command reference", to: "/docs/cli/command-reference" },
          ],
        },
        {
          title: "Project",
          items: [
            { label: "digstore on GitHub", href: "https://github.com/DIG-Network/digstore" },
            { label: "Releases", href: "https://github.com/DIG-Network/digstore/releases" },
            { label: "DIG Network", href: "https://dig.net" },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} DIG Network. DigStore is open source under GPL-2.0.`,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "rust", "json", "toml"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

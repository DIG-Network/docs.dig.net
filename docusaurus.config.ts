import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "DIG Network",
  tagline:
    "A Proof-of-Stake Layer 2 on Chia — developer docs for the network and its primitives.",
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
      title: "Docs",
      logo: {
        alt: "DIG Network",
        src: "img/brand/Wordmark-Black.svg",
        srcDark: "img/brand/Wordmark-white.svg",
        href: "/",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Documentation",
        },
        {
          to: "/docs/digstore/what-is-digstore",
          label: "DigStore",
          position: "left",
        },
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
            { label: "DIG Network", to: "/docs/" },
            { label: "DigStore", to: "/docs/digstore/what-is-digstore" },
          ],
        },
        {
          title: "DigStore",
          items: [
            { label: "The Format", to: "/docs/digstore/format/overview" },
            { label: "CLI Quick start", to: "/docs/digstore/cli/quickstart" },
            { label: "Command reference", to: "/docs/digstore/cli/command-reference" },
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

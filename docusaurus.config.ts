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
        // preset-classic bundles @docusaurus/plugin-sitemap and enables it by
        // default. Configure it explicitly so it is clearly NOT disabled — this
        // emits /sitemap.xml at the site root listing every public route.
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
          filename: "sitemap.xml",
        },
      } satisfies Preset.Options,
    ],
  ],

  // headTags only carries metadata Docusaurus does NOT already auto-emit.
  // Docusaurus (theme-classic) auto-emits, from `title` + the description in
  // `themeConfig.metadata` + `themeConfig.image`: <link rel="canonical">,
  // og:title, og:description, og:url, og:image, twitter:title,
  // twitter:description and twitter:image — all as absolute https URLs on
  // `url`. The tags below complete the Open Graph / Twitter / robots surface.
  headTags: [
    // Brand color (cosmic-navy canvas / DIG violet accent — see custom.css).
    {
      tagName: "meta",
      attributes: { name: "theme-color", content: "#0a0a20" },
    },
    // Public, unauthenticated docs — explicitly invite indexing.
    {
      tagName: "meta",
      attributes: { name: "robots", content: "index, follow" },
    },
    // ---- Open Graph (fields Docusaurus does not emit on its own) ----
    {
      tagName: "meta",
      attributes: { property: "og:type", content: "website" },
    },
    {
      tagName: "meta",
      attributes: { property: "og:site_name", content: "DIG Network Docs" },
    },
    {
      tagName: "meta",
      attributes: { property: "og:locale", content: "en_US" },
    },
    {
      tagName: "meta",
      attributes: { property: "og:image:width", content: "1200" },
    },
    {
      tagName: "meta",
      attributes: { property: "og:image:height", content: "630" },
    },
    {
      tagName: "meta",
      attributes: {
        property: "og:image:alt",
        content: "DIG Network — a Proof-of-Stake Layer 2 on Chia",
      },
    },
    // ---- Twitter (image alt + verified network handle) ----
    {
      tagName: "meta",
      attributes: {
        name: "twitter:image:alt",
        content: "DIG Network — a Proof-of-Stake Layer 2 on Chia",
      },
    },
    {
      tagName: "meta",
      attributes: { name: "twitter:site", content: "@digdotnet" },
    },
    {
      tagName: "meta",
      attributes: { name: "twitter:creator", content: "@digdotnet" },
    },
  ],

  themeConfig: {
    colorMode: {
      defaultMode: "dark",
      respectPrefersColorScheme: true,
    },
    // Default social-card image. Docusaurus resolves this against `url` into an
    // absolute https URL and emits it as og:image + twitter:image.
    image: "img/brand/Wordmark-Stacked-Glow.png",
    // Site-wide default metadata. Docusaurus emits <meta name="description">
    // and the matching og:description / twitter:description from the
    // `description` entry, and the twitter:card type from the other entry.
    metadata: [
      {
        name: "description",
        content:
          "Developer docs for DIG Network — a Proof-of-Stake Layer 2 on Chia for publishing, addressing, and serving content without trusting the host.",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    navbar: {
      title: "Docs",
      logo: {
        alt: "DIG Network",
        src: "img/brand/Wordmark-Black.svg",
        srcDark: "img/brand/Wordmark-white.svg",
        href: "/",
      },
      items: [
        // Subtle pre-release marker — mirrors hub's lowercase "alpha" pill so the
        // ecosystem reads as one product. Styled by `.navbar-alpha-badge` in custom.css.
        {
          type: "html",
          position: "left",
          value:
            '<span class="navbar-alpha-badge" title="Pre-release — expect rough edges">alpha</span>',
        },
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
          to: "/docs/support/get-help",
          label: "Get help",
          position: "right",
        },
        {
          href: "https://discord.gg/dignetwork",
          position: "right",
          className: "navbar-discord-link",
          "aria-label": "DIG Network Discord",
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
            { label: "CLI tutorial", to: "/docs/digstore/cli/quickstart" },
            { label: "Command reference", to: "/docs/digstore/cli/command-reference" },
          ],
        },
        {
          title: "Community & support",
          items: [
            { label: "Get help", to: "/docs/support/get-help" },
            { label: "Troubleshooting", to: "/docs/support/troubleshooting" },
            { label: "FAQ", to: "/docs/support/faq" },
            { label: "Changelog", to: "/docs/support/changelog" },
            { label: "Status", to: "/docs/support/status" },
            { label: "Discord", href: "https://discord.gg/dignetwork" },
          ],
        },
        {
          title: "Project",
          items: [
            { label: "digstore on GitHub", href: "https://github.com/DIG-Network/digstore" },
            { label: "Releases", href: "https://github.com/DIG-Network/digstore/releases" },
            { label: "DIG Network", href: "https://dig.net" },
            { label: "Whitepapers", to: "/docs/whitepapers" },
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

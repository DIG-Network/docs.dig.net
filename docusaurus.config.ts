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
  onBrokenAnchors: "throw",
  onBrokenMarkdownLinks: "warn",

  // Client-only first-visit browser-locale redirect. Docusaurus has no built-in
  // "send a first-time visitor to their browser language" behaviour; this module
  // adds it (once per browser, never overriding a manual LocaleDropdown choice),
  // mirroring hub.dig.net's detectBrowserLocale resolution. See the file header.
  clientModules: ["./src/clientLocaleRedirect.ts"],

  i18n: {
    defaultLocale: "en",
    locales: [
      "en",
      "zh-CN",
      "zh-TW",
      "ko",
      "ja",
      "ru",
      "es",
      "pt-BR",
      "fr",
      "de",
      "tr",
      "vi",
      "id",
      "hi",
    ],
    // Endonyms + direction mirror hub.dig.net's SUPPORTED_LOCALES table
    // (apps/web/i18n/locales.ts) so the language name a user sees is
    // identical across docs.dig.net and hub.dig.net.
    localeConfigs: {
      en: { label: "English", direction: "ltr", htmlLang: "en" },
      "zh-CN": { label: "简体中文", direction: "ltr", htmlLang: "zh-CN" },
      "zh-TW": { label: "繁體中文", direction: "ltr", htmlLang: "zh-TW" },
      ko: { label: "한국어", direction: "ltr", htmlLang: "ko" },
      ja: { label: "日本語", direction: "ltr", htmlLang: "ja" },
      ru: { label: "Русский", direction: "ltr", htmlLang: "ru" },
      es: { label: "Español", direction: "ltr", htmlLang: "es" },
      "pt-BR": { label: "Português (Brasil)", direction: "ltr", htmlLang: "pt-BR" },
      fr: { label: "Français", direction: "ltr", htmlLang: "fr" },
      de: { label: "Deutsch", direction: "ltr", htmlLang: "de" },
      tr: { label: "Türkçe", direction: "ltr", htmlLang: "tr" },
      vi: { label: "Tiếng Việt", direction: "ltr", htmlLang: "vi" },
      id: { label: "Bahasa Indonesia", direction: "ltr", htmlLang: "id" },
      hi: { label: "हिन्दी", direction: "ltr", htmlLang: "hi" },
    },
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
        // emits /sitemap.xml (per locale — see robots.txt) listing every
        // public route. `ignorePatterns` excludes Docusaurus's own internal
        // routes that carry no real content and must never be indexed.
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
          filename: "sitemap.xml",
          ignorePatterns: ["/404.html", "/markdown-page"],
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
    // NOTE: the site-wide "index, follow" robots default lives in
    // `themeConfig.metadata` below, NOT here. `headTags` is injected as
    // static HTML in the SSR template, outside react-helmet-async's
    // reconciliation — a per-page Helmet-managed override (e.g.
    // src/theme/NotFound's noindex) can't dedupe against it, so both tags
    // would ship simultaneously (verified: a static headTags "index, follow"
    // plus a Helmet noindex both landed in 404.html's raw output, an
    // ambiguous double robots meta some crawlers may resolve unpredictably).
    // `themeConfig.metadata` flows through the SAME Helmet pipeline as every
    // page-level override, so it dedupes correctly by tag name.
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
    // ---- Site-wide JSON-LD (schema.org) ----
    // A single @graph emitted on every page: the Organization, the WebSite
    // (with a SearchAction the per-page TechArticle/DefinedTerm blocks attach
    // to via isPartOf), and the two machine-readable Datasets (the dig RPC
    // OpenRPC + the cross-surface error catalog). This gives crawlers/agents a
    // stable site identity and a discoverable pointer to the machine surfaces
    // without executing JS. Per-page entity JSON-LD lives in
    // src/theme/DocItem/Footer (TechArticle / DefinedTerm).
    {
      tagName: "script",
      attributes: { type: "application/ld+json" },
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": "https://dig.net/#organization",
            name: "DIG Network",
            url: "https://dig.net",
            sameAs: [
              "https://github.com/DIG-Network",
              "https://discord.gg/v78aygUZt",
              "https://x.com/digdotnet",
            ],
          },
          {
            "@type": "WebSite",
            "@id": "https://docs.dig.net/#website",
            name: "DIG Network Documentation",
            url: "https://docs.dig.net/",
            inLanguage: "en",
            publisher: { "@id": "https://dig.net/#organization" },
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: "https://docs.dig.net/search?q={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
          },
          {
            "@type": "Dataset",
            "@id": "https://docs.dig.net/openrpc.json#dataset",
            name: "dig RPC OpenRPC document",
            description:
              "Machine-readable OpenRPC 1.2.6 spec for the dig JSON-RPC read interface (rpc.dig.net): methods, request/response JSON Schemas, and catalogued error responses.",
            url: "https://docs.dig.net/docs/rpc/methods",
            encodingFormat: "application/json",
            distribution: {
              "@type": "DataDownload",
              encodingFormat: "application/json",
              contentUrl: "https://docs.dig.net/openrpc.json",
            },
            isPartOf: { "@id": "https://docs.dig.net/#website" },
            creator: { "@id": "https://dig.net/#organization" },
          },
          {
            "@type": "Dataset",
            "@id": "https://docs.dig.net/error-codes.json#dataset",
            name: "DIG ecosystem error-code catalog",
            description:
              "Cross-surface error catalog: dig RPC JSON-RPC codes, dig-store CLI exit codes, DIGHUb user-facing codes, and dig:// loader codes, as [{surface, code, http_or_exit, description}].",
            url: "https://docs.dig.net/docs/support/error-codes",
            encodingFormat: "application/json",
            distribution: {
              "@type": "DataDownload",
              encodingFormat: "application/json",
              contentUrl: "https://docs.dig.net/error-codes.json",
            },
            isPartOf: { "@id": "https://docs.dig.net/#website" },
            creator: { "@id": "https://dig.net/#organization" },
          },
        ],
      }),
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
      // Public, unauthenticated docs — explicitly invite indexing by default.
      // Lives here (not in the static `headTags` array above) so a
      // page-level override (src/theme/NotFound's noindex) flows through the
      // SAME react-helmet-async pipeline and dedupes correctly instead of
      // both tags shipping side by side.
      { name: "robots", content: "index, follow" },
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
          label: "dig-store",
          position: "left",
        },
        {
          to: "/docs/support/get-help",
          label: "Get help",
          position: "right",
        },
        {
          type: "localeDropdown",
          position: "right",
        },
        {
          href: "https://discord.gg/v78aygUZt",
          position: "right",
          className: "navbar-discord-link",
          "aria-label": "DIG Network Discord",
        },
        {
          href: "https://github.com/DIG-Network/dig-store",
          position: "right",
          className: "navbar-github-link",
          "aria-label": "GitHub repository",
        },
      ],
    },
    footer: {
      style: "dark",
      logo: {
        alt: "dig-store — by DIG Network",
        src: "img/brand/wordmark-with-slogan-white.svg",
        href: "https://dig.net",
        width: 200,
      },
      links: [
        {
          title: "Documentation",
          items: [
            { label: "DIG Network", to: "/docs/" },
            { label: "dig-store", to: "/docs/digstore/what-is-digstore" },
          ],
        },
        {
          title: "dig-store",
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
            // Live status dashboard for the DIG services (rpc.dig.net /
            // hub.dig.net / on.dig.net). Points at the external dashboard rather
            // than the internal /docs/support/status reference so the footer has
            // exactly one canonical "Status" link to the live page.
            { label: "Status", href: "https://status.dig.net/" },
            { label: "Discord", href: "https://discord.gg/v78aygUZt" },
            { label: "@digdotnet", href: "https://x.com/digdotnet" },
          ],
        },
        {
          title: "Project",
          items: [
            { label: "dig-store on GitHub", href: "https://github.com/DIG-Network/dig-store" },
            { label: "Releases", href: "https://github.com/DIG-Network/dig-store/releases" },
            { label: "DIG Network", href: "https://dig.net" },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} DIG Network. dig-store is open source under GPL-2.0.`,
    },
    prism: {
      theme: prismThemes.oneLight,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "rust", "json", "toml"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

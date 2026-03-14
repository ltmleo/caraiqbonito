import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Carai Que Bonito!',
  tagline: 'Curiosidades e dicas sobre lugares incríveis',
  favicon: 'img/logo.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  /*
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },
  */

  // Set the production url of your site here
  url: 'https://ltmleo.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/caraiqbonito/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ltmleo', // Usually your GitHub org/user name.
  projectName: 'caraiqbonito', // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  presets: [
    [
      'classic',
      {
        gtag: {
          trackingID: 'G-714QFE3V9G',
          anonymizeIP: true,
        },
        docs: {
          path: 'destinos',
          routeBasePath: 'destinos',
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/ltmleo/caraiqbonito/edit/main',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/logo.png',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Carai Que Bonito!',
      logo: {
        alt: 'Carai Que Bonito! Logo',
        src: '/img/logo.png',
      },
      items: [
        {
          to: '/catalogo',
          label: 'Catálogo',
          position: 'left',
        },
        {
          to: '/destinos/europa',
          label: 'Europa',
          position: 'left',
        },
        {
          to: '/destinos/americas',
          label: 'Américas',
          position: 'left',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Europa',
          items: [
            {
              label: 'Berlim',
              to: '/destinos/europa/central/berlim/',
            },
            {
              label: 'Praga',
              to: '/destinos/europa/central/praga/',
            },
            {
              label: 'Viena',
              to: '/destinos/europa/central/viena/',
            },
            {
              label: 'Budapeste',
              to: '/destinos/europa/central/budapeste/',
            },
          ],
        },
        {
          title: 'Américas',
          items: [
            {
              label: 'Foz do Iguaçu',
              to: '/destinos/americas/brasil/foz-do-iguacu/',
            },
          ],
        },
        {
          title: 'Social',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/ltmleo/caraiqbonito',
            },
            {
              label: 'Blog',
              to: '/blog',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Carai Que Bonito! Construído com Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    /*
    algolia: {
      // The application ID provided by Algolia
      appId: 'PXW2V2BV3M',

      // Public API key: it is safe to commit it
      apiKey: 'db2a10bceffa9302d6d02a9f18519c06',

      indexName: 'ltmleoio',

      // Optional: see doc section below
      contextualSearch: false,

      // Optional: Algolia search parameters
      searchParameters: {},

      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: 'search',

      // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
      insights: false,

      //... other Algolia params
    },
    */
  } satisfies Preset.ThemeConfig,
};

export default config;

// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Hotay Resources',
  tagline: 'Recursos e práticas de desenvolvimento utilizadas na Hotay',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://hotaydev.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  trailingSlash: true,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'hotaydev', // Usually your GitHub org/user name.
  projectName: 'hotaydev.github.io', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/hotaydev/hotaydev.github.io/tree/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/banner.jpg',
      navbar: {
        title: 'Hotay Resources',
        logo: {
          alt: 'Hotay Software Development Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentações',
          },
          {
            href: 'https://github.com/hotaydev/hotaydev.github.io',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentações',
            items: [
              {
                label: 'Docker',
                to: '/docs/docker',
              },
              {
                label: 'Pipelines',
                to: '/docs/pipelines',
              },
              {
                label: 'Segurança',
                to: '/docs/security',
              },
              {
                label: 'Shell Script',
                to: '/docs/shell-script',
              },
            ],
          },
          {
            title: 'Comunidade',
            items: [
              {
                label: 'LinkedIn',
                href: 'https://linkedin.com/company/hotay',
              },
              {
                label: 'Instagram',
                href: 'https://www.instagram.com/hotaydev',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/hotaydev',
              },
            ],
          },
          {
            title: 'Mais',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/hotaydev/hotaydev.github.io',
              },
              {
                label: 'Site da Hotay',
                href: 'https://hotay.dev',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Hotay Software Development.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;

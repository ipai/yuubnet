/**
 * Configuration for @cloudflare/next-on-pages
 * https://github.com/cloudflare/next-on-pages
 */
export default {
  // Customize the build output
  build: {
    // External modules that should not be bundled
    external: ['cookie', 'node:*'],
  },
  // Customize the Cloudflare Pages deployment
  cloudflare: {
    // Ensure compatibility with Next.js
    compatibilityDate: '2025-01-29',
    compatibilityFlags: ['nodejs_compat'],
  },
};

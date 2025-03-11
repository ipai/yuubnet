# Yuub.net
This is the source for my portfolio page, currently built with Next.js on Cloudflare Pages.

![Website](https://img.shields.io/website?url=https%3A%2F%2Fyuub.net)

## Deploy Pages
```bash
pnpm run pages:build && \
npx wrangler pages deploy ./vercel/output/static
```

## Deploy Cloudflare Workers
```bash
npx wrangler deploy --config workers/wrangler.asset-fetch.toml
npx wrangler deploy --config workers/wrangler.analytics.toml
```

## Develop locally

### Setup Asset Files
For local development, you'll need to set up your asset files:
```bash
# Copy the example files
cp public/resume/resume.pdf.example public/resume/resume.pdf
cp public/resume/resume.png.example public/resume/resume.png
cp public/resume/resume.webp.example public/resume/resume.webp
```

**Note:** In production, the PNG will be served via Cloudflare Images as WebP, and the PDF via Cloudflare R2/Workers. These local files are only used for development.

### Start Development Server
```bash
pnpm dev
```

## Test locally
```bash
pnpm test
```

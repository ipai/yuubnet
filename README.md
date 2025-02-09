# Yuub.net
This is the source for my portfolio page, currently built with Next.js on Cloudflare Pages.


## Deploy Pages
```bash
pnpm run pages:build && \
wrangler pages deploy .vercel/output/static
```

## Deploy analytics database
```bash
npx wrangler deploy
```

## Develop locally
```bash
pnpm dev
```

## Test locally
```bash
pnpm test
```
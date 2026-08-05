# Wedgewood Ravine HOA Website

Professional redesign of [wedgewood.ca](https://www.wedgewood.ca/) — Next.js front end with existing Knack portal embeds.

## Design direction

Upscale, nature-forward, lightly early-90s brochure aesthetic with a brick + forest palette. Community photography and documents were taken from the Weebly site export.

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Knack

Embed definitions live in `src/lib/site.ts` (`embeds`). They were extracted from the Weebly export custom HTML blocks and iframes.

## Google Maps

Our Community and Contact use the Maps JavaScript API for a satellite (hybrid) view with business POIs hidden.

1. Create a key in [Google Cloud Console](https://console.cloud.google.com/) with **Maps JavaScript API** enabled.
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
3. Restrict the key by HTTP referrer (`localhost:3000/*`, your production domain) when you deploy.

Without the key, those pages fall back to the free iframe embed (which still shows business labels).

## Deploy notes

Weebly hosting will not serve this app. Deploy to Vercel, Netlify, or Cloudflare Pages, then point the `wedgewood.ca` DNS records at the new host when ready.

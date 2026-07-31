# 보성녹돈 website

A single-page marketing site for 보성녹돈 (Korean BBQ / meat-shop restaurant, 무거동, 울산),
built with Vite + React + TypeScript + Tailwind CSS + Framer Motion.

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
npm run preview   # serve the production build locally
```

## Editing content

Almost everything on the site — phone numbers, addresses, business hours, the
setting fee, menu items, gallery captions, Naver Map links — is centralized in
**`src/data/content.ts`**. Edit that one file to update the site; no component
changes are needed for text/data changes.

Two values still need real data from the owner:

- `NAVER_MAP_MAIN_URL` / `NAVER_MAP_NEW_URL` in `src/data/content.ts` — currently
  placeholder Naver Map search-query links. Replace with the exact share URLs.
- `menuItems` prices in `src/data/content.ts` — currently `price: null` (rendered
  as "가격 문의") since the final menu/prices haven't been confirmed yet.

## Adding real photos

No real photography or the official logo file were available while building this
site, so every photo slot renders an on-brand placeholder ("사진 준비중") via
`src/components/SmartImage.tsx` instead of a broken image. See
`public/images/README.md` for the exact file paths to drop real photos into —
each one is picked up automatically once the file exists, no code changes needed.

## Structure

- `src/data/content.ts` — single source of truth for all restaurant data
- `src/types/content.ts` — TypeScript types for that data
- `src/components/` — one component per section (Header, Hero, BranchSection,
  MenuSection, Gallery, Directions, PhoneContact, Footer, MobileActionBar, …)
- `src/components/SmartImage.tsx` — image component with placeholder fallback
- `src/components/StructuredData.tsx` — injects Restaurant JSON-LD for SEO

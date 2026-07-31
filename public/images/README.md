# Image assets — replace these

No real photos or the official logo file were supplied yet, so the site currently
renders elegant placeholder tiles (via `src/components/SmartImage.tsx`) wherever a
real photo belongs. Nothing is broken — it just clearly says "사진 준비중" until real
files are dropped in.

To go live, add real files at the exact paths below (the site will pick them up
automatically, no code changes needed):

## Logo
- `public/images/logo.svg` (or `logo.png`) — official 보성녹돈 logo, transparent background

## Hero
- `public/images/hero/hero-main.jpg` — large landscape hero photo (meat selection or signature dish), ≥1920×1080

## Gallery (see `src/data/content.ts` → `galleryImages` for the full list + captions)
- `public/images/gallery/*.jpg` — one file per entry, filenames listed in content.ts

## Branch cards
- `public/images/branch/main-hall.jpg` — 본관 exterior or dining room
- `public/images/branch/new-hall.jpg` — 신관 exterior or dining room

## Menu (optional)
- `public/images/menu/full-menu.jpg` — full printed menu photo, opened in the "전체 메뉴 보기" modal

All images should be optimized (compressed JPG/WebP) before adding, ideally under
300KB each, to keep the site fast on mobile networks.

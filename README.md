# ARQA Palm Villas website

Inquiry-led demo site for ARQA Palm Villas, Alfonso, Cavite. React + TypeScript + Vite, no backend.

## Run locally

Requires Node.js 20+ and, only for regenerating media, Python 3 with Pillow (AVIF support) and ffmpeg on PATH.

A portable Node 24 LTS was installed for this build at
`%LOCALAPPDATA%\Programs\node-v24.21.0-win-x64`. Add it to PATH, or install Node normally.

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve dist/ at http://localhost:4173
```

`dist/` is a static site. Upload its contents to any static host. It is a single page with `#` anchors, so direct visits need no route rewrites.

## Media

- Originals live in `../Initial Assets` and are never modified.
- `media/catalog.json` is the human-edited catalog: alt text, captions, focal points, role, approval status, public/excluded and why.
- `npm run media` (or `python -I scripts/build_media.py --videos-only`) regenerates `public/media/**` and the typed data file `src/data/media.json`, read through `src/data/media.ts`.
- Videos are copied byte-for-byte (H.264 + AAC, already faststart), so the original audio is untouched.

## Where to change things

| What | File |
|---|---|
| Public copy | `src/data/content.ts` |
| Inquiry destinations (email / WhatsApp stay `null` until verified) | `src/data/contacts.ts` |
| Gallery order | `galleryPhotos` in `src/data/media.ts` |
| Colours, type, spacing | tokens at the top of `src/styles.css` |
| Social preview / title | `index.html` |

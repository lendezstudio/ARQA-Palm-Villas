# ARQA Palm Villas: build handover

Prepared 28 October 2026 for Lendez Studio. This is a working local demo. Nothing has been deployed, and there is no backend.

## 1. What was built

One page, in the order set by the brief: sticky header → cinematic hero → introduction (single H1) → villa index → dark "Time at ARQA" → Spaces at ARQA gallery → location → planning questions → final invitation → footer.

Every **Check Availability**, **Start an Inquiry** and **Ask About This Villa** button opens the same inquiry drawer. **Ask for Directions** opens it too, with a message pre-filled asking for the location pin. The drawer prepares a readable message. The visitor then copies it and continues on Facebook. No submission, storage, analytics or "sent" state exists.

There is no sign-in, registration, account, loyalty, payment, live availability or WhatsApp action anywhere.

## 2. Design rationale

**Reference.** Hyatt's page returned 403 to automated fetches, so it could not be re-inspected. The layout follows the briefing's documented reference translation:
- restrained header with menu left, logo centred and booking action right
- full-bleed hero with only a small control overlay
- pale centred introduction carrying the headline
- one large image at a time with thin arrows and a 01 / 03 counter
- dark editorial section
- broad gallery that shows the edges of neighbouring images
- practical sections, then an inquiry-led close

**ARQA identity.**
- The supplied logo is shown unaltered: only the surrounding white was trimmed, and it sits on a white plate that hangs from the header, as the reference's central mark does.
- Proposed tokens: ivory, sand, charcoal, deep palm, with gold used only for hairline accents, never for text.
- Type: Cormorant Garamond Light for headings and Noto Sans Display for body. Both are self-hosted (Fontsource, OFL).
- Squared buttons, fine rules, no cards or gradients.

**Ratios** (one per component family):
- gallery tiles 4:3
- hero, introduction, location and invitation 16:9
- dark-section slides 4:5
- the lightbox shows each photo whole

**Motion.** Short fades only. There is no scroll-jacking or auto-advance. Reduced motion and data-saver settings get a still image with manual playback.

**Hero.** All supplied footage is portrait (9:16), so cropping it to a landscape hero would lose roughly 70% of the frame and upscale it. The hero therefore works like this:
- **Landscape screens:** the dusk pool still (`821621848`).
- **Portrait screens:** a 9.3-second muted loop cut from people-free, title-free moments of the Villa Raia film, with a visible pause button.
- **All screens:** a **Watch with Sound** button opens the full film with its audio.

## 3. Video inventory (all inspected locally)

| File (prefix) | Dims / length | Audio | Content | Status |
|---|---|---|---|---|
| AQO2OGgvGx3o | 720×1280, 0:34 | AAC stereo 44.1 kHz, peak −0.7 dB | Owner film. **Title card "VILLA RAIA · ARQA PALM VILLAS" at 0:02–0:04** over the circular-window villa. Ends on the ARQA logo. Adult model at 0:00–0:01, 0:11, 0:22–0:23. | **Public**, `villa_id: villa-raia`. Also the source of the hero loop. |
| AQPoNW_x22kT | 720×1280, 0:31 | AAC stereo, peak −1.1 dB | Owner film. **Title card "BALAI MOHAN · ARQA PALM VILLAS" at 0:02–0:04** over the thatched-roof villa. No people seen. | **Public**, `villa_id: balai-mohan` |
| AQNRnqXvj9TB | 716×1276, 1:19 | AAC stereo, peak −0.3 dB | Walkthrough of the circular-window villa with **identifiable children** (the same children as excluded photo 865878515) and adults. | Excluded: permission review |
| AQN0M628fiXE | 720×1280, 3:48 | AAC stereo, peak −0.3 dB | Appears to be a **third-party creator vlog** ("hidden gem in Alfonso Cavite"), with presenters, swimwear and road footage. | Excluded: rights and releases unknown |
| AQO5HiOvl5t7 | 720×1280, 0:20 | AAC stereo, peak −3.2 dB | Event table with buffet warmers. | Excluded: implies event/catering services |

**What was tested with audio:** both public films. In Chrome, clicking a film opens the viewer and the clip plays unmuted at full volume. The decoded-audio byte counter is above zero, which proves the audio track is actually being played. Native controls and a fullscreen button are available. Closing pauses the clip and releases the file. Only one source is audible at a time: the hero loop pauses while a viewer is open and resumes afterwards.

**Captions:** none. No speech-recognition tool was available to transcribe accurately, so I could not tell whether the soundtracks contain speech or only music. The owner should confirm this, and also confirm the **music licence** for web use. Music in Facebook/Instagram reels is often licensed for those platforms only.

## 4. Photo inventory

There are 51 JPEGs in `Initial Assets`: the 19 the researcher reviewed plus 32 new ones. 31 are public; 20 are excluded:

- **Logo** (1): shown unaltered in the header and footer.
- **Gallery** (30): 13 Interiors, 11 Poolside, 6 Details. All `villa_id: null`.
- **Excluded** (20):
  - 1 low-resolution duplicate (`690355212`)
  - 2 marketing graphics (`689747717` comparison graphic; `861905332` "Same-Week Booking Promo" showing **₱10,999, up to 18 pax, check-in 3:00 PM / check-out 12:00 noon**, which is undated and unconfirmed, so not published)
  - 8 event-styling photos (`819913667` has people present; `829196…` ×5, `833346853`, `833391858` imply catering/events)
  - 1 photo of identifiable children (`865878515`)
  - 8 four-photo social collages (`862805874`, `862932149`, `863248809`, `865370603`, `865774906`, `865945170`, `867106233`, `867852732`). These don't fit single-image frames. Request the individual originals; several show bathrooms and kitchens that are not in the public set.

Full per-file records, including alt text, captions, focal points and reasons for exclusion, are in `media/catalog.json` and `src/data/media.json`.

### Proposed photo-to-villa mapping (NOT applied)

The two titled films show three distinct buildings. These visual matches are strong, but they are inference rather than owner confirmation, so every photo stays `villa_id: null` in the public data:

- **Circular-window villa → likely Villa Raia** (it matches the titled film): `821621848`, `698800734`, `823758476`, `822341642`, `820327520`, `864632676`, `697380803`, `822286649`, `820935152`, `819921360`, `822276487`, `689012395`, `821656408`.
- **Thatched-roof villa → likely Balai Mohan** (it matches the titled film): `819902593`, `824121441`, `862805884`, `823787232`, `819921615`, `819913674`, `819966897_…343666`, `819966897_…370270`, `821104091`, `820410691`.
- **Pitched timber-and-stone villa → unknown** (possibly Kaia Suite by elimination, with no evidence): `818977476`, `687041933`, `822298384`, `861778584`, `819539723`, and probably `820336365` (its grey walls and circular artworks match the stone-villa collages).
- **Unassigned:** `820935148` (timber window detail; the building can't be identified).

Once the owner confirms, set `villa_id` in `media/catalog.json` and rebuild. The villa index can then gain photographs and, eventually, detail pages.

## 5. Owner confirmations still needed

1. **Villa names and inventory.** Villa Raia and Balai Mohan are named in the owner's own films. **Kaia Suite appears only in public listings**: confirm it is current and how it differs.
2. **Photo-to-villa mapping**: confirm or correct the proposed list above.
3. **Per-villa facts**: bedrooms, beds, bathrooms, overnight and day-visitor capacity, pool details (depth, heating, safety), inclusions. Public sources conflict. The promo graphic says "up to 18 pax", while a listing says 15.
4. **Rates and stay times**: the promo graphic shows ₱10,999 (Sun–Thu) and 3:00 PM / 12:00 noon. Confirm whether it is current, which villa it applies to, and the conditions.
5. **Contacts.** `arqapalmvillarental@gmail.com` is not enabled. Verify it before setting `contacts.email`; that turns on an **Open Email Draft** action. Supply a WhatsApp Business number only if one exists.
6. **Address and map pin.** Lot 7426 Bilog-Buck Estate Road appears in listings but is not shown. Once confirmed, add the address and switch the location button to "Open in Google Maps".
7. **People releases**: the adult model in the Villa Raia film; the children and guests in the excluded walkthrough and photo.
8. **Rights to the creator vlog** (AQN0M6) and the **soundtrack licences** for both public films.
9. **Events and catering**: whether these are offered (several photos and one reel suggest they are). Keep them off the site until confirmed.
10. **Policies**: pets, visitors, cooking, cancellation and deposit, accessibility, privacy and terms pages.
11. **Production domain**: needed for canonical/`og:url` and absolute `og:image` URLs. They are currently relative.
12. **Logo**: a vector or transparent version would render more crisply than the supplied 959 px JPEG.

## 6. Validation report

- `npm run build`: TypeScript typecheck and Vite production build pass.
- **Widths 360, 390, 768, 1024, 1440:**
  - no horizontal overflow
  - every gallery frame at a given width is identical 4:3 (e.g. 760×570 at 1440)
  - no broken images
  - no console errors or failed or 4xx requests
- **Automated interaction run (Playwright, real Chrome):**
  - **Inquiry composer:**
    - validation messages for missing check-in, missing adults, check-out before check-in and non-whole guest counts (`2.5`, `-1`)
    - focus moves to the first invalid field
    - the message matches the copy-deck template
    - villa and directions presets work
    - Edit Details keeps the entered values
    - nothing is written to storage or the URL
    - the Facebook link opens `https://www.facebook.com/arqapalmvillas` in a new tab
  - **Clipboard:** success shows "Inquiry copied." and the clipboard contents were verified. With clipboard access denied, the page shows "Select and copy the message below." and selects the text.
  - **Dialogs:** Escape closes the drawer, menu and viewers, focus returns to the button that opened them, and Tab stays inside the open dialog.
  - **Video:**
    - plays with sound on click
    - fits within 90vw × 85vh
    - pauses and releases the file on close
    - if the browser blocks play(), a visible **Play with sound** button appears and works
  - **Mobile hero:** the muted loop plays, pauses while a viewer is open and resumes after, and the pause control works.
  - **Reduced motion:** no autoplay, all content visible, Watch with Sound still available.
  - **Network:** on desktop, no MP4 is downloaded before a visitor asks for it.
  - **Other components:** the gallery filters (13 / 11 / 6 / 2 / 32 items), arrows and counter, the lightbox with arrow keys, the dark-section carousel, the mobile menu navigation and the footer credit link all work.
- **Not verified:**
  - Safari/iOS fullscreen (the `webkitEnterFullscreen` fallback is coded but untested)
  - real Facebook message pasting
  - a live deployment

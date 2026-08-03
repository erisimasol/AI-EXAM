# Amigos SACCO — Brand Application Guide

**System:** AI-Proctored Examination System
**Owner:** PMERLF Directorate — Learning & Capacity Development
**Applies to:** `frontend/` and `backend/`

This document records how the Amigos identity is applied across the examination
system, and — more importantly — where to change it so a future update is one
edit rather than forty.

---

## 1. The two files that matter

Everything brand-related resolves from two mirrored modules:

| File | Scope |
|---|---|
| `frontend/src/theme/brand.js` | All client rendering: UI, certificates, verification page |
| `backend/config/brandConfig.js` | All server output: API payloads, certificate issuer record, future email templates |

**Rule: no component may hard-code a brand hex value.** If you find yourself
typing `#ED7B2B`, import `BRAND.orange` instead. The only files permitted to
contain brand literals are the two above.

The server also exposes the whole identity at `GET /api/brand` (public, no
auth), so any downstream Amigos service — a reporting export, an email
renderer — can pull the palette rather than copy it.

---

## 2. The 70/30 rule

The Amigos identity is 70% orange, 30% deep blue. In this system that ratio is
enforced structurally, not just in the palette:

- **Orange `#ED7B2B` owns action.** Buttons, active navigation, links, focus
  rings, progress bars. It is what the eye lands on, which is the ~70%.
- **Deep blue `#323D89` owns structure.** Headings, table heads, the app bar,
  and every *authority* surface — the certificate frame, the verification
  page, the issuing seal. That is the ~30%.

The ratio also appears literally, as a graphic device. `GRADIENTS.brandBar` is
a 3px divider that is 70% orange and 30% blue by width. It runs:

- along the foot of the app bar (every screen)
- along the top edge of every MUI `Card` (via the theme's `MuiCard` override)
- under the sidebar lockup
- under the wordmark inside the logo itself
- across the head of the certificate

This is the one decorative move in the system, and it earns its place by doing
a job — separating identity from content — while encoding the brand ratio.

---

## 3. Logo

### The artwork

The emblem is the **official Amigos logo**, supplied as raster artwork and
vector-traced for this system. Four orange arcs and five member dots form a
cooperative circle around the Amharic motto **"ህብረት ለስምረት!"** — *Hibret
LeSimret*, "Unity for harmony."

Trace fidelity was measured, not assumed: **99.53% per-pixel agreement** with
the source raster, **98.55% IoU** on the orange layer and **98.39%** on the
navy motto. The vector is used rather than the PNG so the emblem stays crisp on
a printed certificate and inside a favicon.

### Responsive logo rule

The motto sits *inside* the circle and stops being legible below roughly
**120px**. So the system carries two cuts of the emblem and chooses by size:

| Cut | Motto? | Use at |
|---|---|---|
| `amigos-logo-full.svg` | yes | ≥ 120px — certificate, auth screens, verification page, OG card |
| `amigos-mark.svg` | no | < 120px — favicon, app bar, avatars, watermark, PWA icons |

`<AmigosLogo variant="auto" height={n} />` applies that rule from the height
prop, which is the safe default when you do not know the final size.

### Colour

The supplied artwork measures **#F36D21** orange and **#2A2C91** navy. The
house palette used across the PMERLF document suite is **#ED7B2B** and
**#323D89**. The difference is small but visible when the emblem sits beside a
button, so the system renders the emblem in the **house palette** for internal
consistency.

To render it in the artwork's own colours instead, point the imports in
`AmigosLogo.jsx` at `amigos-logo-full-source.svg`. Both cuts ship.

### Files

| Asset | Use |
|---|---|
| `amigos-logo-full.svg` | Full emblem with motto, house palette |
| `amigos-logo-full-white.svg` | Same, for dark grounds |
| `amigos-logo-full-source.svg` | Same, in the artwork's own measured colours |
| `amigos-mark.svg` / `amigos-mark-white.svg` | Emblem without motto, small sizes |
| `amigos-logo.svg` / `amigos-logo-light.svg` | Horizontal lockup: emblem + wordmark |
| `amigos-seal.svg` | Circular issuing seal — certificates and verification only |
| `*.png` alongside each | Raster cuts for Word / PowerPoint / email |
| `amigos-brand-sheet.png` | One-page reference for this whole system |
| `frontend/public/favicon.ico` | 7 embedded resolutions, 16→256, from the mark cut |
| `frontend/public/logo192.png`, `logo512.png`, `apple-touch-icon.png` | PWA / iOS |
| `frontend/public/og-image.png` | 1200×630 social preview for shared certificate links |

### In code — always use the component

```jsx
import AmigosLogo from 'src/components/brand/AmigosLogo';

<AmigosLogo variant="full" height={86} />       // certificate head, auth screens
<AmigosLogo variant="mark" height={28} />       // app bar, avatars, watermark
<AmigosLogo variant="lockup" height={44} />     // sidebar, page headers
<AmigosLogo variant="lockup" tone="light" />    // on a dark ground
<AmigosLogo variant="seal" height={82} />       // certificate, verification page
<AmigosLogo variant="auto" height={n} />        // picks full or mark by size
```

The SVGs are inlined by SVGR at build time, so they land in the DOM as real
`<svg>` elements. That matters for the PDF export path — `html2canvas` often
renders a linked `<img>` as a blank box.

## 4. Typography

| Role | Stack | Where |
|---|---|---|
| `FONTS.ui` | Plus Jakarta Sans + Noto Sans Ethiopic | All screen text, both languages |
| `FONTS.document` | Calibri → Carlito → Plus Jakarta Sans | Certificates, so a printed credential matches Amigos stationery |
| `FONTS.display` | Noto Serif Ethiopic → Georgia | Certificate display lines only |

English and Amharic sit in **one stack**, so a bilingual sentence does not
change weight mid-line. Carlito is the metric-compatible open fallback for
Calibri — it substitutes without reflowing a certificate laid out in Calibri.

Amharic is handled by a `:lang(am)` rule in `public/index.html`, so any element
marked `lang="am"` picks up Ethiopic automatically without a class on every
node. This is what satisfies **FP-10.3** (Amharic in exported PDFs) — the
Ethiopic families must be loaded in the document for `html2canvas` to
rasterise them.

---

## 5. Two deliberate exceptions

Neither of these is an oversight. Do not "fix" them.

**Social share buttons keep the platforms' own colours.** LinkedIn blue,
WhatsApp green, Telegram cyan. A LinkedIn button that is not LinkedIn blue
reads as a phishing button, which is the opposite of what a credential-sharing
flow needs. See the note at the top of `ShareCertificate.jsx`.

**The status ramp sits outside the brand pair.** Success, warning, error and
info are their own colours (`STATUS` in `brand.js`), so a failed attempt never
reads as "off-brand" and a warning chip is never mistaken for a primary
action. Warning is nudged away from `#ED7B2B` for exactly this reason.

Badge tier metals (gold / silver / bronze) are likewise metallic rather than
brand-coloured — a credential tier is an achievement signal, not a brand
signal — but each sits on a brand-tinted face.

---

## 6. What was removed

The build was based on the AdminMart "Modernize" React template. These
remnants were found and removed:

- `radial-gradient(#d2f1df, #d3d7fa, #bad8f4)` — stock green/blue auth wash on
  Login, Register, UserAccount and CreateExamPage → now `GRADIENTS.authWash`
- "New to **Modernize**?" on the login card
- The "Unlimited Access / Upgrade" upsell in `Updrade.js`, which linked to the
  template vendor's store → replaced with `SupportCard`, an in-exam help panel
- `AI EVAL_8` hardcoded in the mobile sidebar
- `components/Certificate.jsx` in gold `#b8860b` and Georgia → rebranded
- A stock photo of a stranger used as the profile avatar → brand initials
- `layouts/full/header/data.js` — dead template demo data with 14 broken asset
  references
- `assets/images/logos/a.webp` and `dark-logo.svg` — vendor stock marks
- The placeholder "interlocking rings" mark built in the first branding pass
  — replaced entirely by the traced official Amigos emblem
- `package.json` was still named `"modernize"` → `amigos-sacco-exam-portal`

---

## 7. Regenerating the raster assets

After changing any SVG, from `frontend/`:

```bash
pip install cairosvg pillow
python3 - <<'PY'
import cairosvg
from PIL import Image
L = 'src/assets/images/logos'
cairosvg.svg2png(url=f'{L}/amigos-logo.svg',       write_to=f'{L}/amigos-logo.png',       output_width=900, output_height=192)
cairosvg.svg2png(url=f'{L}/amigos-logo-light.svg', write_to=f'{L}/amigos-logo-light.png', output_width=900, output_height=192)
cairosvg.svg2png(url=f'{L}/amigos-mark.svg',       write_to=f'{L}/amigos-mark.png',       output_width=512, output_height=512)
cairosvg.svg2png(url=f'{L}/amigos-seal.svg',       write_to=f'{L}/amigos-seal.png',       output_width=600, output_height=600)
for s in (192, 512):
    cairosvg.svg2png(url=f'{L}/amigos-mark.svg', write_to=f'public/logo{s}.png', output_width=s, output_height=s)
cairosvg.svg2png(url=f'{L}/amigos-mark.svg', write_to='public/apple-touch-icon.png',
                 output_width=180, output_height=180, background_color='white')
ims = []
for s in (16, 24, 32, 48, 64, 128, 256):
    cairosvg.svg2png(url=f'{L}/amigos-mark.svg', write_to=f'/tmp/f{s}.png', output_width=s, output_height=s)
    ims.append(Image.open(f'/tmp/f{s}.png').convert('RGBA'))
ims[-1].save('public/favicon.ico', format='ICO', sizes=[(i.width, i.height) for i in ims])
PY
```

---

## 8. Known gaps

These are outside the branding pass but will bite:

1. **Branch list is incomplete.** `frontend/src/data/orgData.js` and its mirror
   `backend/config/constants.js` list 9 branches. The network is 53 across four
   districts plus Head Office. Certificates snapshot `branch` at issue time, so
   any candidate at a missing branch gets a blank field on a permanent record.
2. **The Amharic strings in `brand.js` / `brandConfig.js` need review by a
   native speaker** before they appear on an issued certificate. They are a
   reasonable rendering, not a verified translation.
3. **The CEO's name is not set.** The certificate now carries two signature
   blocks — CEO for the Society, Chief of PMERLF for the assessment process —
   and `CEO_NAME` in `.env` is an explicit placeholder. **Set it before issuing
   anything.** A certificate goes out with a public, verifiable serial; it
   cannot be quietly corrected afterwards. Optional scanned signature PNGs go
   in `frontend/public/signatures/` (see the README there). Leave them unset
   and the certificate prints ruled lines for wet signing, which is the correct
   behaviour if certificates are signed after printing.
4. **No dark theme.** The theme exports `baselightTheme` only. If dark mode is
   wanted, `brand.js` already has the ramps needed to build it.

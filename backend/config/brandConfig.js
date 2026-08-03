// =============================================================================
// AMIGOS SACCO — BRAND CONFIG (server side)
// Mirror of frontend/src/theme/brand.js. Anything the server renders or emits
// that carries the Amigos identity — emails, PDF headers, the public
// verification payload, the OG tags on a shared certificate link — reads from
// here, so a brand change is a change in two files rather than forty.
//
// KEEP IN SYNC WITH: frontend/src/theme/brand.js
// =============================================================================

export const BRAND_COLORS = {
  // 70% of brand surface area — actions, accents, energy.
  orange: "#ED7B2B",
  orangeDark: "#C4611A",
  orangeDeep: "#A34E12",
  orangeTint: "#FDECDE",
  orangeTintStrong: "#FAD7B8",

  // 30% — structure, headings, authority surfaces.
  blue: "#323D89",
  blueDark: "#232B61",
  blueDeep: "#161C41",
  blueTint: "#E7E9F5",
  blueTintStrong: "#C6CCE6",

  ink: "#232B61",
  inkMuted: "#5A6A85",
  inkFaint: "#7C8FAC",
  line: "#E5EAEF",
  surface: "#FFFFFF",
  surfaceAlt: "#F7F9FC",
  surfaceSunken: "#F2F6FA",
};

// Status ramp, deliberately outside the brand pair so a failed attempt never
// reads as "off-brand" and a warning chip is never mistaken for a CTA.
export const STATUS_COLORS = {
  success: "#1E9E6A",
  warning: "#E0A800",
  error: "#D14343",
  info: "#3E6FD6",
};

export const BRAND_FONTS = {
  ui: "'Plus Jakarta Sans', 'Noto Sans Ethiopic', 'Segoe UI', Helvetica, Arial, sans-serif",
  document:
    "Calibri, 'Carlito', 'Plus Jakarta Sans', 'Noto Sans Ethiopic', 'Segoe UI', sans-serif",
  display: "'Noto Serif Ethiopic', Georgia, 'Times New Roman', serif",
};

// The 70/30 rule expressed as a CSS gradient, for use in HTML emails and any
// server-rendered document header.
export const BRAND_RULE_CSS =
  `linear-gradient(90deg, ${BRAND_COLORS.orange} 0%, ${BRAND_COLORS.orange} 70%, ` +
  `${BRAND_COLORS.blue} 70%, ${BRAND_COLORS.blue} 100%)`;

export const BRAND_ORG = {
  name: "Amigos Saving & Credit Cooperative Society Ltd.",
  nameAm: "አሚጎስ ቁጠባና ብድር ኅብረት ሥራ ማኅበር ኃ.የተ.",
  shortName: "Amigos SACCO",
  shortNameAm: "አሚጎስ ሳኮ",
  systemName: "AI-Proctored Examination System",
  systemNameAm: "በአርቴፊሻል ኢንተለጀንስ የሚቆጣጠር የፈተና ሥርዓት",
  unit: "PMERLF Directorate — Learning & Capacity Development",
  tagline: "Secure assessment. Verified competence.",
  taglineAm: "ጥብቅ ምዘና። የተረጋገጠ ብቃት።",
  // Motto set inside the official emblem.
  motto: "ህብረት ለስምረት!",
  mottoEn: "Unity for harmony",
  supportEmail: process.env.SUPPORT_EMAIL || "pmerlf@amigossacco.com",
  website: process.env.ORG_WEBSITE || "https://www.amigossacco.com",
};

// Logo endpoints, resolved against whatever origin the app is served from.
// Kept as paths (not absolute URLs) so the same config works on localhost,
// Vercel preview builds and the production domain.
// Measured from the supplied logo artwork; see frontend/src/theme/brand.js
// LOGO_SOURCE for why the system renders in the house palette instead.
export const LOGO_SOURCE_COLORS = { orange: "#F36D21", navy: "#2A2C91" };

export const BRAND_ASSETS = {
  markSvg: "/static/media/amigos-mark.svg",
  logoPng: "/logo512.png",
  icon192: "/logo192.png",
  icon512: "/logo512.png",
  ogImage: "/og-image.png",
  favicon: "/favicon.ico",
};

// Single payload the frontend (or any downstream consumer, e.g. a reporting
// service generating Amigos-branded exports) can fetch from GET /api/brand.
export const brandPayload = () => ({
  org: BRAND_ORG,
  colors: BRAND_COLORS,
  status: STATUS_COLORS,
  fonts: BRAND_FONTS,
  rule: BRAND_RULE_CSS,
  assets: BRAND_ASSETS,
  ratio: { orange: 70, blue: 30 },
});

export default {
  BRAND_COLORS,
  STATUS_COLORS,
  BRAND_FONTS,
  BRAND_RULE_CSS,
  BRAND_ORG,
  BRAND_ASSETS,
  brandPayload,
};

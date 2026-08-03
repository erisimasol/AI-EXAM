// =============================================================================
// AMIGOS SACCO — BRAND TOKENS
// Single source of truth for the visual identity of the AI-Proctored
// Examination System. Nothing in the app should hard-code a brand hex value;
// import from here instead.
//
// Identity rule (Amigos brand system):
//   ORANGE  #ED7B2B  ~70% of brand surface area — primary actions, active nav,
//                    links, key accents, the "energy" of the interface.
//   BLUE    #323D89  ~30% — headers, headings, structure, authority surfaces
//                    (certificates, verification, official statements).
//
// Keep in sync with backend/config/brandConfig.js.
// =============================================================================

// ---- Source artwork measurements --------------------------------------------
// Sampled directly from the supplied Amigos logo file. These differ slightly
// from the house palette below, which is the palette used across the PMERLF
// document suite. The system renders the logo in the HOUSE colours so the
// emblem does not sit a shade off from every button beside it. To render the
// emblem in its own measured colours instead, swap the imports in
// components/brand/AmigosLogo.jsx to the `-source` SVG cut.
export const LOGO_SOURCE = {
  orange: '#F36D21', // vs house #ED7B2B
  navy: '#2A2C91', // vs house #323D89
};

// ---- Core marks -------------------------------------------------------------
export const BRAND = {
  orange: '#ED7B2B',
  orangeDark: '#C4611A',
  orangeDeep: '#A34E12',
  orangeTint: '#FDECDE', // 12% wash — hover states, light fills
  orangeTintStrong: '#FAD7B8', // 30% wash — borders on tinted surfaces

  blue: '#323D89',
  blueDark: '#232B61',
  blueDeep: '#161C41',
  blueTint: '#E7E9F5',
  blueTintStrong: '#C6CCE6',

  // Neutral ramp used across cards, tables and body copy.
  ink: '#232B61', // primary text — blue-biased so copy sits in the family
  inkMuted: '#5A6A85',
  inkFaint: '#7C8FAC',
  line: '#E5EAEF',
  surface: '#FFFFFF',
  surfaceAlt: '#F7F9FC',
  surfaceSunken: '#F2F6FA',
};

// ---- Gradients & decorative fills -------------------------------------------
// Used on auth screens, hero strips and the certificate ground.
export const GRADIENTS = {
  // Auth background wash — orange-led, blue-anchored, per the 70/30 rule.
  authWash: `radial-gradient(circle at 20% 20%, ${BRAND.orangeTint}, ${BRAND.blueTint} 55%, ${BRAND.orangeTintStrong})`,
  // Solid brand bar for headers and certificate ribbons.
  brandBar: `linear-gradient(90deg, ${BRAND.orange} 0%, ${BRAND.orange} 70%, ${BRAND.blue} 70%, ${BRAND.blue} 100%)`,
  // Soft card header used on dashboard panels.
  panel: `linear-gradient(135deg, ${BRAND.blue} 0%, ${BRAND.blueDark} 100%)`,
  cta: `linear-gradient(135deg, ${BRAND.orange} 0%, ${BRAND.orangeDark} 100%)`,
};

// ---- The 70/30 rule as a graphic device -------------------------------------
// A 3px two-tone divider whose proportions ARE the brand ratio. Drop it under
// page headers, on top of cards, and along the certificate edge.
export const RULE_70_30 = {
  height: 3,
  background: GRADIENTS.brandBar,
  border: 0,
  borderRadius: 2,
};

// ---- Typography -------------------------------------------------------------
// UI face: Plus Jakarta Sans (screen). Amharic: Noto Sans Ethiopic.
// Document/print face: Calibri (Amigos house font) with Carlito as the
// metric-compatible open fallback — used on certificates so the credential
// matches printed Amigos stationery.
export const FONTS = {
  ui: "'Plus Jakarta Sans', 'Noto Sans Ethiopic', 'Segoe UI', Helvetica, Arial, sans-serif",
  document:
    "Calibri, 'Carlito', 'Plus Jakarta Sans', 'Noto Sans Ethiopic', 'Segoe UI', sans-serif",
  display:
    "'Noto Serif Ethiopic', Georgia, 'Times New Roman', serif", // certificate display lines
  mono: "'JetBrains Mono', 'Courier New', monospace",
};

// ---- Status colours ---------------------------------------------------------
// Deliberately kept outside the brand pair so "pass/fail" never reads as
// "on-brand/off-brand". Warning is nudged away from the brand orange so a
// warning chip is not mistaken for a primary action.
export const STATUS = {
  success: '#1E9E6A',
  successTint: '#E4F5ED',
  warning: '#E0A800',
  warningTint: '#FCF3D9',
  error: '#D14343',
  errorTint: '#FBE9E9',
  info: '#3E6FD6',
  infoTint: '#E8EEFB',
};

// ---- Proctoring severity ----------------------------------------------------
// Violation severity has its own ramp: it must be legible at a glance in the
// cheating log and must not compete with brand orange.
export const SEVERITY = {
  none: STATUS.success,
  low: '#E0A800',
  medium: '#E2711D',
  high: STATUS.error,
  critical: '#8E1F1F',
};

// ---- Badge tiers ------------------------------------------------------------
// Mirrors backend/config/certificateConfig.js BADGE_TIERS. Medal metals are
// intentionally metallic rather than brand-coloured — a credential tier is an
// achievement signal, not a brand signal — but each sits on a brand-tinted face.
export const TIERS = {
  distinction: { ring: '#D4AF37', ringDark: '#A8871F', face: '#FBF0CE', text: '#4A3A00' },
  merit: { ring: '#AEB6C2', ringDark: '#828C9B', face: '#EDF0F5', text: '#333C4B' },
  pass: { ring: '#CD7F32', ringDark: '#9E5F22', face: '#F7E2CE', text: '#5A3210' },
};

// ---- Organisation identity --------------------------------------------------
export const ORG = {
  name: 'Amigos Saving & Credit Cooperative Society Ltd.',
  nameAm: 'አሚጎስ ቁጠባና ብድር ኅብረት ሥራ ማኅበር ኃ.የተ.',
  shortName: 'Amigos SACCO',
  shortNameAm: 'አሚጎስ ሳኮ',
  systemName: 'AI-Proctored Examination System',
  systemNameAm: 'በአርቴፊሻል ኢንተለጀንስ የሚቆጣጠር የፈተና ሥርዓት',
  unit: 'PMERLF Directorate — Learning & Capacity Development',
  tagline: 'Secure assessment. Verified competence.',
  taglineAm: 'ጥብቅ ምዘና። የተረጋገጠ ብቃት።',
  // The motto set inside the official emblem.
  motto: 'ህብረት ለስምረት!',
  mottoTranslit: 'Hibret LeSimret!',
  mottoEn: 'Unity for harmony',
  placeOfIssue: 'Addis Ababa, Ethiopia',
  website: 'https://www.amigossacco.com',
  serialPrefix: 'AMI-CERT',
};

// Convenience alias so components can read `brand.orange` etc.
const brand = { ...BRAND, GRADIENTS, RULE_70_30, FONTS, STATUS, SEVERITY, TIERS, ORG };
export default brand;

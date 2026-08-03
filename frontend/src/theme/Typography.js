import { FONTS } from './brand';

// =============================================================================
// AMIGOS SACCO — TYPE SCALE
// Two faces with distinct jobs:
//   FONTS.ui        Plus Jakarta Sans + Noto Sans Ethiopic — all screen text,
//                   English and Amharic, from one stack so a bilingual sentence
//                   does not change weight mid-line.
//   FONTS.document  Calibri (Amigos house font) with Carlito as the open,
//                   metric-compatible fallback — used on certificates so a
//                   printed credential matches Amigos stationery exactly.
//
// Headings run heavier and tighter than the template default: this is an
// assessment system, and headings are wayfinding, not decoration.
// =============================================================================

const ui = FONTS.ui;

const typography = {
  fontFamily: ui,
  h1: { fontWeight: 700, fontSize: '2.25rem', lineHeight: '2.75rem', fontFamily: ui, letterSpacing: '-0.02em' },
  h2: { fontWeight: 700, fontSize: '1.875rem', lineHeight: '2.25rem', fontFamily: ui, letterSpacing: '-0.015em' },
  h3: { fontWeight: 700, fontSize: '1.5rem', lineHeight: '1.85rem', fontFamily: ui, letterSpacing: '-0.01em' },
  h4: { fontWeight: 700, fontSize: '1.3125rem', lineHeight: '1.6rem', fontFamily: ui },
  h5: { fontWeight: 600, fontSize: '1.125rem', lineHeight: '1.6rem', fontFamily: ui },
  h6: { fontWeight: 600, fontSize: '1rem', lineHeight: '1.25rem', fontFamily: ui },
  button: { textTransform: 'none', fontWeight: 600, fontFamily: ui },
  body1: { fontSize: '0.875rem', fontWeight: 400, lineHeight: '1.4rem', fontFamily: ui },
  body2: { fontSize: '0.75rem', letterSpacing: '0rem', fontWeight: 400, lineHeight: '1.05rem', fontFamily: ui },
  subtitle1: { fontSize: '0.875rem', fontWeight: 500, fontFamily: ui },
  subtitle2: { fontSize: '0.875rem', fontWeight: 400, fontFamily: ui },
  // Eyebrow label used above page titles and on the certificate.
  overline: {
    fontSize: '0.6875rem',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    fontFamily: ui,
  },
  caption: { fontSize: '0.6875rem', fontWeight: 400, fontFamily: ui },
};

export default typography;

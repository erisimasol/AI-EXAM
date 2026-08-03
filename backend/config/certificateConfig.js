import {
  BRAND_ORG,
  BRAND_COLORS,
  BRAND_RULE_CSS,
  BRAND_ASSETS,
} from "./brandConfig.js";

// Certification & digital-badge configuration for Amigos SACCO's AI-Proctored
// Examination System. Centralizes issuing-organization branding, the minimum
// score required to earn a certificate, and the badge tiers awarded by score.
//
// These values are consumed by the certificate model, the issuance util, and
// the verification/issuance controllers. The frontend fetches the resolved
// tier per certificate, so tier thresholds live here (single source of truth).

// Issuing organization shown on every certificate and verification page.
// Identity strings and colours are re-exported from ./brandConfig.js so the
// credential can never drift from the rest of the Amigos brand system.
export const CERT_ORG = {
  name: BRAND_ORG.name,
  nameAm: BRAND_ORG.nameAm,
  shortName: BRAND_ORG.shortName,
  shortNameAm: BRAND_ORG.shortNameAm,
  unit: BRAND_ORG.unit,
  // ---------------------------------------------------------------------
  // SIGNATORIES
  // The certificate carries two signature lines: the CEO signs for the
  // Society, the Chief of PMERLF signs for the assessment itself. Two
  // signatures is the norm for a training credential — one attests to the
  // institution, the other to the process.
  //
  // >>> ACTION REQUIRED <<<
  // `ceoName` is a placeholder. Set it (and, if you have one, a scanned
  // signature image) BEFORE issuing any live certificate. A credential that
  // goes out with an unset signatory name cannot be quietly corrected — the
  // serial is already public and verifiable.
  // ---------------------------------------------------------------------
  ceoName: process.env.CEO_NAME || "[SET CEO_NAME IN .env]",
  ceoTitle: "Chief Executive Officer",
  // Optional: path to a transparent PNG of the signature, relative to
  // frontend/public — e.g. "/signatures/ceo-signature.png". Leave empty and
  // the certificate prints a ruled signature line instead.
  ceoSignatureImage: process.env.CEO_SIGNATURE_IMAGE || "",

  signatoryName: process.env.PMERLF_CHIEF_NAME || "Chief of PMERLF",
  signatoryTitle: "Performance Monitoring, Evaluation, Reporting, Learning & Feedback",
  signatorySignatureImage: process.env.PMERLF_SIGNATURE_IMAGE || "",

  // Place of issue, printed beside the date. Ethiopian cooperative practice
  // is to state the place on the face of the credential.
  placeOfIssue: process.env.CERT_PLACE_OF_ISSUE || "Addis Ababa, Ethiopia",
  placeOfIssueAm: "አዲስ አበባ፣ ኢትዮጵያ",
  // Brand marks the certificate renderer draws with.
  brand: {
    orange: BRAND_COLORS.orange,
    blue: BRAND_COLORS.blue,
    rule: BRAND_RULE_CSS,
    seal: BRAND_ASSETS.markSvg,
  },
};

// Serial-number prefix, e.g. AMI-CERT-2026-000123
export const CERT_SERIAL_PREFIX = "AMI-CERT";

// Minimum percentage a candidate must score for a certificate to be issued.
export const CERT_PASS_THRESHOLD = Number(process.env.CERT_PASS_THRESHOLD || 50);

// Badge tiers, evaluated from highest minPercentage downward. The first tier
// whose minPercentage is met (and >= CERT_PASS_THRESHOLD) is awarded.
export const BADGE_TIERS = [
  {
    key: "distinction",
    label: "Distinction",
    medal: "Gold",
    minPercentage: 90,
    color: "#D4AF37", // gold
    description: "Outstanding mastery of the assessed competencies.",
  },
  {
    key: "merit",
    label: "Merit",
    medal: "Silver",
    minPercentage: 75,
    color: "#AEB6C2", // silver — matches TIERS.merit.ring in frontend/src/theme/brand.js
    description: "Strong, above-standard command of the assessed competencies.",
  },
  {
    key: "pass",
    label: "Certified Pass",
    medal: "Bronze",
    minPercentage: CERT_PASS_THRESHOLD,
    color: "#CD7F32", // bronze
    description: "Met the required standard for the assessed competencies.",
  },
];

export const BADGE_TIER_KEYS = BADGE_TIERS.map((t) => t.key);

// Resolve a badge tier object from a percentage score. Returns null when the
// score is below the pass threshold (no certificate/badge earned).
export const resolveBadgeTier = (percentage) => {
  const score = Number(percentage) || 0;
  if (score < CERT_PASS_THRESHOLD) return null;
  return BADGE_TIERS.find((t) => score >= t.minPercentage) || null;
};

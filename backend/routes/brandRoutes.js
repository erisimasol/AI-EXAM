import express from "express";
import { brandPayload } from "../config/brandConfig.js";
import { CERT_ORG, BADGE_TIERS } from "../config/certificateConfig.js";

const router = express.Router();

// @desc    Public brand manifest — colours, type, org identity, asset paths
// @route   GET /api/brand
// @access  Public
//
// Deliberately unauthenticated. The public verification page and any external
// Amigos service that needs to render in-brand (reporting exports, an email
// template renderer) can pull the identity from one place instead of
// hard-coding hex values that then drift.
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      ...brandPayload(),
      certificate: {
        issuer: CERT_ORG,
        tiers: BADGE_TIERS.map(({ key, label, medal, color, minPercentage }) => ({
          key,
          label,
          medal,
          color,
          minPercentage,
        })),
      },
    },
  });
});

export default router;

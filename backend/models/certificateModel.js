import mongoose from "mongoose";
import { BADGE_TIER_KEYS } from "../config/certificateConfig.js";

// A Certificate is the verifiable credential issued to a candidate who meets
// the pass threshold on an exam. It carries a human-readable serial number, a
// URL-safe verification code (encoded into the QR code), and a snapshot of the
// candidate/exam/score at issuance time so the credential stays valid and
// self-describing even if the underlying user or exam record later changes.
const certificateSchema = mongoose.Schema(
  {
    // Human-readable, sequential serial, e.g. AMI-CERT-2026-000123
    serialNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // URL-safe token embedded in the QR code and public verification URL.
    verificationCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    result: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Result",
      required: true,
      unique: true, // one certificate per result
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    examId: {
      type: String,
      required: true,
    },
    // Snapshots captured at issuance (immutable credential facts)
    recipientName: { type: String, required: true },
    recipientEmail: { type: String, default: "" },
    branch: { type: String, default: "" },
    department: { type: String, default: "" },
    examName: { type: String, required: true },
    percentage: { type: Number, required: true, default: 0 },
    totalMarks: { type: Number, default: 0 },
    // Badge tier awarded (distinction | merit | pass)
    badgeTier: {
      type: String,
      enum: BADGE_TIER_KEYS,
      required: true,
    },
    badgeLabel: { type: String, required: true },
    badgeMedal: { type: String, default: "" },
    issuedAt: { type: Date, default: Date.now },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Revocation (e.g. issued in error or integrity breach found later)
    revoked: { type: Boolean, default: false },
    revokedAt: { type: Date },
    revokedReason: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;

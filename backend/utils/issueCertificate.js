import { v4 as uuidv4 } from "uuid";
import Certificate from "../models/certificateModel.js";
import Counter from "../models/counterModel.js";
import Exam from "../models/examModel.js";
import User from "../models/userModel.js";
import {
  CERT_SERIAL_PREFIX,
  resolveBadgeTier,
} from "../config/certificateConfig.js";

// Build a serial like AMI-CERT-2026-000123 using an atomic counter so numbers
// are sequential and never collide across concurrent requests.
const buildSerialNumber = async () => {
  const seq = await Counter.next("certificate");
  const year = new Date().getFullYear();
  const padded = String(seq).padStart(6, "0");
  return `${CERT_SERIAL_PREFIX}-${year}-${padded}`;
};

// Ensure a certificate exists for a given result. Idempotent: if one already
// exists it is returned unchanged. Returns null when the score is below the
// pass threshold (no credential earned). `issuedBy` is the acting user id.
//
// This is intentionally a plain util (not a controller) so it can be called
// both from the certificate controller and from the result-visibility toggle
// without creating controller-to-controller coupling.
export const ensureCertificateForResult = async (result, issuedBy = null) => {
  if (!result) return null;

  // Already issued? Return existing.
  const existing = await Certificate.findOne({ result: result._id });
  if (existing) return existing;

  const tier = resolveBadgeTier(result.percentage);
  if (!tier) return null; // below pass threshold — nothing to issue

  // Resolve snapshot data (recipient + exam context).
  const user = await User.findById(result.userId).select(
    "name email branch department"
  );
  const exam = await Exam.findOne({ examId: result.examId }).select(
    "examName department"
  );

  const serialNumber = await buildSerialNumber();
  const verificationCode = uuidv4();

  try {
    const certificate = await Certificate.create({
      serialNumber,
      verificationCode,
      result: result._id,
      userId: result.userId,
      examId: result.examId,
      recipientName: user?.name || "Candidate",
      recipientEmail: user?.email || "",
      branch: user?.branch || "",
      department: user?.department || exam?.department || "",
      examName: exam?.examName || "Assessment",
      percentage: Number(result.percentage) || 0,
      totalMarks: result.totalMarks || 0,
      badgeTier: tier.key,
      badgeLabel: tier.label,
      badgeMedal: tier.medal,
      issuedBy: issuedBy || undefined,
    });
    return certificate;
  } catch (err) {
    // Handle the race where two requests issue simultaneously: the unique
    // index on `result` rejects the second write — return the winner.
    if (err && err.code === 11000) {
      return await Certificate.findOne({ result: result._id });
    }
    throw err;
  }
};

export default ensureCertificateForResult;

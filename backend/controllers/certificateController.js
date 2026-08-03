import asyncHandler from "express-async-handler";
import Certificate from "../models/certificateModel.js";
import Result from "../models/resultModel.js";
import { ensureCertificateForResult } from "../utils/issueCertificate.js";
import {
  CERT_ORG,
  CERT_PASS_THRESHOLD,
} from "../config/certificateConfig.js";

const MANAGER_ROLES = ["teacher", "department_head", "admin"];

// Shape a certificate document for an authenticated owner/manager response.
const serializeCertificate = (cert) => ({
  _id: cert._id,
  serialNumber: cert.serialNumber,
  verificationCode: cert.verificationCode,
  examId: cert.examId,
  examName: cert.examName,
  recipientName: cert.recipientName,
  recipientEmail: cert.recipientEmail,
  branch: cert.branch,
  department: cert.department,
  percentage: cert.percentage,
  totalMarks: cert.totalMarks,
  badgeTier: cert.badgeTier,
  badgeLabel: cert.badgeLabel,
  badgeMedal: cert.badgeMedal,
  issuedAt: cert.issuedAt,
  revoked: cert.revoked,
  revokedReason: cert.revokedReason,
  org: CERT_ORG,
});

// @desc    Issue (or fetch existing) certificate for a result
// @route   POST /api/certificates/issue/:resultId
// @access  Private (owner of the result, or a manager role)
const issueCertificate = asyncHandler(async (req, res) => {
  const { resultId } = req.params;

  const result = await Result.findById(resultId);
  if (!result) {
    res.status(404);
    throw new Error("Result not found");
  }

  const isOwner = result.userId.toString() === req.user._id.toString();
  const isManager = MANAGER_ROLES.includes(req.user.role);
  if (!isOwner && !isManager) {
    res.status(403);
    throw new Error("Not authorized to issue this certificate");
  }

  // Students may only claim a certificate for a result already released to them.
  if (isOwner && !isManager && !result.showToStudent) {
    res.status(403);
    throw new Error("Result has not been released yet");
  }

  const certificate = await ensureCertificateForResult(result, req.user._id);
  if (!certificate) {
    res.status(400);
    throw new Error(
      `A certificate requires a score of at least ${CERT_PASS_THRESHOLD}%.`
    );
  }

  res.status(201).json({ success: true, data: serializeCertificate(certificate) });
});

// @desc    Get all certificates for the logged-in user
// @route   GET /api/certificates/my
// @access  Private
const getMyCertificates = asyncHandler(async (req, res) => {
  const certificates = await Certificate.find({ userId: req.user._id }).sort({
    issuedAt: -1,
  });
  res.status(200).json({
    success: true,
    data: certificates.map(serializeCertificate),
  });
});

// @desc    Get a single certificate the user owns (or manages) by id
// @route   GET /api/certificates/:id
// @access  Private
const getCertificateById = asyncHandler(async (req, res) => {
  const cert = await Certificate.findById(req.params.id);
  if (!cert) {
    res.status(404);
    throw new Error("Certificate not found");
  }
  const isOwner = cert.userId.toString() === req.user._id.toString();
  const isManager = MANAGER_ROLES.includes(req.user.role);
  if (!isOwner && !isManager) {
    res.status(403);
    throw new Error("Not authorized to view this certificate");
  }
  res.status(200).json({ success: true, data: serializeCertificate(cert) });
});

// @desc    List all issued certificates (management view)
// @route   GET /api/certificates
// @access  Private (manager roles)
const getAllCertificates = asyncHandler(async (req, res) => {
  if (!MANAGER_ROLES.includes(req.user.role)) {
    res.status(403);
    throw new Error("Not authorized to view all certificates");
  }
  const certificates = await Certificate.find().sort({ issuedAt: -1 });
  res.status(200).json({
    success: true,
    data: certificates.map(serializeCertificate),
  });
});

// @desc    Revoke / un-revoke a certificate
// @route   PUT /api/certificates/:id/revoke
// @access  Private (manager roles)
const revokeCertificate = asyncHandler(async (req, res) => {
  if (!MANAGER_ROLES.includes(req.user.role)) {
    res.status(403);
    throw new Error("Not authorized to revoke certificates");
  }
  const cert = await Certificate.findById(req.params.id);
  if (!cert) {
    res.status(404);
    throw new Error("Certificate not found");
  }
  const revoke = req.body.revoked !== undefined ? !!req.body.revoked : !cert.revoked;
  cert.revoked = revoke;
  cert.revokedAt = revoke ? new Date() : undefined;
  cert.revokedReason = revoke ? req.body.reason || "Revoked by issuer" : "";
  await cert.save();
  res.status(200).json({ success: true, data: serializeCertificate(cert) });
});

// @desc    Public verification of a certificate by its verification code or serial
// @route   GET /api/certificates/verify/:code
// @access  Public (no auth — this is the QR-code target)
const verifyCertificate = asyncHandler(async (req, res) => {
  const { code } = req.params;

  const cert = await Certificate.findOne({
    $or: [{ verificationCode: code }, { serialNumber: code }],
  });

  if (!cert) {
    return res.status(200).json({
      success: true,
      valid: false,
      message: "No certificate matches this code. It may be invalid or forged.",
    });
  }

  // Public payload — deliberately limited (no email, no internal ids).
  res.status(200).json({
    success: true,
    valid: !cert.revoked,
    revoked: cert.revoked,
    message: cert.revoked
      ? "This certificate has been revoked by the issuing organization."
      : "This certificate is authentic and was issued by " + CERT_ORG.shortName + ".",
    certificate: {
      serialNumber: cert.serialNumber,
      recipientName: cert.recipientName,
      examName: cert.examName,
      branch: cert.branch,
      department: cert.department,
      percentage: cert.percentage,
      badgeTier: cert.badgeTier,
      badgeLabel: cert.badgeLabel,
      badgeMedal: cert.badgeMedal,
      issuedAt: cert.issuedAt,
      org: CERT_ORG,
    },
  });
});

export {
  issueCertificate,
  getMyCertificates,
  getCertificateById,
  getAllCertificates,
  revokeCertificate,
  verifyCertificate,
};

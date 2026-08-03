import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  issueCertificate,
  getMyCertificates,
  getCertificateById,
  getAllCertificates,
  revokeCertificate,
  verifyCertificate,
} from "../controllers/certificateController.js";

const certificateRoutes = express.Router();

// PUBLIC — QR-code verification target. Must stay unauthenticated so anyone
// (an employer, a regulator) can scan the QR and confirm authenticity.
certificateRoutes.get("/verify/:code", verifyCertificate);

// All routes below require authentication.
certificateRoutes.use(protect);

certificateRoutes.get("/", getAllCertificates); // manager list
certificateRoutes.get("/my", getMyCertificates); // current user's certificates
certificateRoutes.post("/issue/:resultId", issueCertificate);
certificateRoutes.put("/:id/revoke", revokeCertificate);
certificateRoutes.get("/:id", getCertificateById);

export default certificateRoutes;

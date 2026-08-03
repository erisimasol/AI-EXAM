import mongoose from "mongoose";

// Define a schema for the cheating log
const cheatingLogSchema = new mongoose.Schema(
  {
    noFaceCount: { type: Number, default: 0 },
    multipleFaceCount: { type: Number, default: 0 },
    cellPhoneCount: { type: Number, default: 0 },
    prohibitedObjectCount: { type: Number, default: 0 },
    // Secure browser control violations
    tabSwitchCount: { type: Number, default: 0 },
    copyPasteAttemptCount: { type: Number, default: 0 },
    fullscreenExitCount: { type: Number, default: 0 },

    examId: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    branch: { type: String },
    department: { type: String },

    // Overall priority for supervisor triage (built from the counts above)
    severity: {
      type: String,
      enum: ["none", "low", "medium", "high"],
      default: "none",
    },

    screenshots: [
      {
        url: { type: String, required: true },
        type: {
          type: String,
          enum: [
            "noFace",
            "multipleFace",
            "cellPhone",
            "prohibitedObject",
            "tabSwitch",
            "copyPasteAttempt",
            "fullscreenExit",
          ],
          required: true,
        },
        detectedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create a model using the schema
const CheatingLog = mongoose.model("CheatingLog", cheatingLogSchema);

export default CheatingLog;

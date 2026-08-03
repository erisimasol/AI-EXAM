import asyncHandler from "express-async-handler";
import { Parser as CsvParser } from "json2csv";
import CheatingLog from "../models/cheatingLogModel.js";

const computeSeverity = (log) => {
  const total =
    (log.noFaceCount || 0) +
    (log.multipleFaceCount || 0) +
    (log.cellPhoneCount || 0) +
    (log.prohibitedObjectCount || 0) +
    (log.tabSwitchCount || 0) +
    (log.copyPasteAttemptCount || 0) +
    (log.fullscreenExitCount || 0);

  if (total === 0) return "none";
  if (total <= 2) return "low";
  if (total <= 5) return "medium";
  return "high";
};

// @desc Save cheating log data
// @route POST /api/cheatingLogs
// @access Private
const saveCheatingLog = asyncHandler(async (req, res) => {
  const {
    noFaceCount,
    multipleFaceCount,
    cellPhoneCount,
    prohibitedObjectCount,
    tabSwitchCount,
    copyPasteAttemptCount,
    fullscreenExitCount,
    examId,
    username,
    email,
    branch,
    department,
    screenshots,
  } = req.body;

  const counts = {
    noFaceCount,
    multipleFaceCount,
    cellPhoneCount,
    prohibitedObjectCount,
    tabSwitchCount,
    copyPasteAttemptCount,
    fullscreenExitCount,
  };

  const cheatingLog = new CheatingLog({
    ...counts,
    examId,
    username,
    email,
    branch,
    department,
    screenshots: screenshots || [],
    severity: computeSeverity(counts),
  });

  const savedLog = await cheatingLog.save();

  if (savedLog) {
    res.status(201).json(savedLog);
  } else {
    res.status(400);
    throw new Error("Invalid Cheating Log Data");
  }
});

// @desc Get all cheating log data for a specific exam
// @route GET /api/cheatingLogs/:examId
// @access Private
const getCheatingLogsByExamId = asyncHandler(async (req, res) => {
  const examId = req.params.examId;
  const cheatingLogs = await CheatingLog.find({ examId });

  res.status(200).json(cheatingLogs);
});

// @desc    Export incident logs as CSV for structured post-exam review /
//          audit trail (optionally scoped to one exam)
// @route   GET /api/cheatingLogs/export/csv?examId=
// @access  Private (supervisors)
const exportCheatingLogsCsv = asyncHandler(async (req, res) => {
  const { examId } = req.query;
  const filter = examId ? { examId } : {};
  const logs = await CheatingLog.find(filter).lean();

  const rows = logs.map((log) => ({
    examId: log.examId,
    username: log.username,
    email: log.email,
    branch: log.branch || "",
    department: log.department || "",
    severity: log.severity,
    noFaceCount: log.noFaceCount,
    multipleFaceCount: log.multipleFaceCount,
    cellPhoneCount: log.cellPhoneCount,
    prohibitedObjectCount: log.prohibitedObjectCount,
    tabSwitchCount: log.tabSwitchCount,
    copyPasteAttemptCount: log.copyPasteAttemptCount,
    fullscreenExitCount: log.fullscreenExitCount,
    evidenceCount: (log.screenshots || []).length,
    recordedAt: log.createdAt,
  }));

  const parser = new CsvParser();
  const csv = rows.length ? parser.parse(rows) : "No incidents recorded";

  res.header("Content-Type", "text/csv");
  res.attachment(`incident-report-${examId || "all"}.csv`);
  res.send(csv);
});

export {
  saveCheatingLog,
  getCheatingLogsByExamId,
  exportCheatingLogsCsv,
};

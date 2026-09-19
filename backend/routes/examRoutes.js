import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import {
  createExam,
  DeleteExamById,
  getExamById,
  getExams,
} from "../controllers/examController.js";
import {
  createQuestion,
  getQuestionsByExamId,
  getQuestionBank,
  getRandomQuestionsForExam,
} from "../controllers/quesController.js";
import {
  getCheatingLogsByExamId,
  saveCheatingLog,
  exportCheatingLogsCsv,
} from "../controllers/cheatingLogController.js";
const examRoutes = express.Router();

// protecting Exam route using auth middleware protect /api/users/
examRoutes.route("/exam").get(protect, getExams).post(protect, createExam);
examRoutes.route("/exam/questions").post(protect, createQuestion);
examRoutes.route("/exam/questions/:examId").get(protect, getQuestionsByExamId);
examRoutes.route("/exam/questions/bank/search").get(protect, getQuestionBank);
examRoutes.route("/exam/questions/random/:examId").get(protect, getRandomQuestionsForExam);
examRoutes.route("/cheatingLogs/:examId").get(protect, getCheatingLogsByExamId);
examRoutes.route("/cheatingLogs/").post(protect, saveCheatingLog);
examRoutes.route("/cheatingLogs/export/csv").get(protect, exportCheatingLogsCsv);
examRoutes.route("/exam/:examId").get(protect, getExamById).post(protect, DeleteExamById);

export default examRoutes;

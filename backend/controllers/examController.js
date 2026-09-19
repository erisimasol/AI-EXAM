import asyncHandler from "express-async-handler";
import Exam from "./../models/examModel.js";

// @desc Get all exams (optionally filtered by branch/department for
//       branch-level integration & department-level access control)
// @route GET /api/exams
// @access Public
const getExams = asyncHandler(async (req, res) => {
  const { branch, department } = req.query;
  const filter = {};
  if (department) filter.department = department;
  if (branch) filter.branches = { $in: [branch] };

  const exams = await Exam.find(filter);
  res.status(200).json(exams);
});

// @desc Create a new exam
// @route POST /api/exams
// @access Private (admin)
const getExamById = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  const exam = await Exam.findOne({ examId });
  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }
  res.status(200).json(exam);
});

const createExam = asyncHandler(async (req, res) => {
  const {
    examName,
    description,
    totalQuestions,
    duration,
    liveDate,
    deadDate,
    department,
    branches,
    examType,
    difficultyLevel,
    gradingScheme,
    randomizeQuestions,
  } = req.body;

  const exam = new Exam({
    examName,
    description,
    totalQuestions,
    duration,
    liveDate,
    deadDate,
    department,
    branches: Array.isArray(branches) ? branches : branches ? [branches] : [],
    examType,
    difficultyLevel,
    gradingScheme,
    randomizeQuestions,
    createdBy: req.user?._id,
  });

  const createdExam = await exam.save();

  if (createdExam) {
    res.status(201).json(createdExam);
  } else {
    res.status(400);
    throw new Error("Invalid Exam Data");
  }
});

const DeleteExamById = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  const exam = await Exam.findOneAndDelete({ examId: examId });
  if (!exam) {
    res.status(404);
    throw new Error("Exam not found");
  }
  console.log("deleted exam", exam);
  res.status(200).json(exam);
});

export { getExams, getExamById, createExam, DeleteExamById };

import asyncHandler from "express-async-handler";
import Question from "../models/quesModel.js";

const getQuestionsByExamId = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  console.log("Question Exam id ", examId);

  if (!examId) {
    return res.status(400).json({ error: "examId is missing or invalid" });
  }

  const questions = await Question.find({ examId });
  console.log("Question Exam  ", questions);

  res.status(200).json(questions);
});

const createQuestion = asyncHandler(async (req, res) => {
  const { question, options, examId, department, topic, difficulty, ansmarks } = req.body;

  if (!examId) {
    return res.status(400).json({ error: "examId is missing or invalid" });
  }

  const newQuestion = new Question({
    question,
    options,
    examId,
    department,
    topic,
    difficulty,
    ansmarks,
  });

  const createdQuestion = await newQuestion.save();

  if (createdQuestion) {
    res.status(201).json(createdQuestion);
  } else {
    res.status(400);
    throw new Error("Invalid Question Data");
  }
});

// @desc    Centralized question bank search — filter the validated question
//          repository by department and/or topic for quick retrieval
// @route   GET /api/users/questions/bank?department=&topic=
// @access  Private (exam managers)
const getQuestionBank = asyncHandler(async (req, res) => {
  const { department, topic, difficulty } = req.query;
  const filter = {};
  if (department) filter.department = department;
  if (topic) filter.topic = topic;
  if (difficulty) filter.difficulty = difficulty;

  const questions = await Question.find(filter).sort({ createdAt: -1 });
  res.status(200).json(questions);
});

// @desc    Randomized question selection for a given exam to minimize cheating
//          (draws `count` random questions, optionally scoped to a department)
// @route   GET /api/users/questions/random/:examId?count=10
// @access  Private
const getRandomQuestionsForExam = asyncHandler(async (req, res) => {
  const { examId } = req.params;
  const count = parseInt(req.query.count, 10) || 10;

  const questions = await Question.aggregate([
    { $match: { examId } },
    { $sample: { size: count } },
  ]);

  res.status(200).json(questions);
});

export {
  getQuestionsByExamId,
  createQuestion,
  getQuestionBank,
  getRandomQuestionsForExam,
};

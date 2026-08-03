import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { BRANCHES, DEPARTMENTS, EXAM_TYPES, DIFFICULTY_LEVELS } from "../config/constants.js";

const examSchema = mongoose.Schema(
  {
    examName: {
      type: String,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    liveDate: {
      type: Date,
      required: true,
    },
    deadDate: {
      type: Date,
      required: true,
    },
    // Define examId field with UUID generation
    examId: {
      type: String,
      default: uuidv4, // Generate a new UUID for each document
      unique: true, // Ensure uniqueness of UUIDs
    },
    // Department-level exam creation
    department: {
      type: String,
      enum: DEPARTMENTS,
    },
    // Branch-level integration: deployed to one or more branches at once.
    // Empty array = deployed to all branches.
    branches: {
      type: [String],
      enum: BRANCHES,
      default: [],
    },
    examType: {
      type: String,
      enum: EXAM_TYPES,
      default: "multiple-choice",
    },
    difficultyLevel: {
      type: String,
      enum: DIFFICULTY_LEVELS,
      default: "medium",
    },
    gradingScheme: {
      type: String,
      enum: ["standard", "negative-marking", "pass-fail"],
      default: "standard",
    },
    // Question bank: pull a random subset instead of a fixed question set
    randomizeQuestions: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Exam = mongoose.model("Exam", examSchema);

export default Exam;

import mongoose from "mongoose";
import { DEPARTMENTS, DIFFICULTY_LEVELS } from "../config/constants.js";

const questionSchema = mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },
    // Question bank tagging for quick department-specific retrieval and to
    // support randomized selection to minimize cheating
    department: {
      type: String,
      enum: DEPARTMENTS,
    },
    topic: {
      type: String,
    },
    difficulty: {
      type: String,
      enum: DIFFICULTY_LEVELS,
      default: "medium",
    },
    options: [
      {
        optionText: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          required: true,
        },
      },
    ],
    ansmarks: {
      type: Number,
      required: false,
      default: 0,
    },
    examId: {
      type: String, // Use the same data type (String) as in the exam model
      required: true,
      // You can make examId required if it's always present
    },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model("Question", questionSchema);
//83309
export default Question;

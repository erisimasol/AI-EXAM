import { apiSlice } from './apiSlice';

// Define the base URL for the exams API
const EXAMS_URL = '/api/users';

// Inject endpoints for the exam slice
export const examApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all exams
    getExams: builder.query({
      query: () => ({
        url: `${EXAMS_URL}/exam`,
        method: 'GET',
      }),
    }),
    // Create a new exam
    createExam: builder.mutation({
      query: (data) => ({
        url: `${EXAMS_URL}/exam`,
        method: 'POST',
        body: data,
      }),
    }),
    // Get a single exam's details (name, description, duration, etc.)
    getExamById: builder.query({
      query: (examId) => ({
        url: `${EXAMS_URL}/exam/${examId}`,
        method: 'GET',
      }),
    }),
    // Get questions for a specific exam
    getQuestions: builder.query({
      query: (examId) => ({
        url: `${EXAMS_URL}/exam/questions/${examId}`,
        method: 'GET',
      }),
    }),
    // Create a new question for an exam
    createQuestion: builder.mutation({
      query: (data) => ({
        url: `${EXAMS_URL}/exam/questions`,
        method: 'POST',
        body: data,
      }),
    }),

    //Delete an exam
    deleteExam: builder.mutation({
      query: (examId) => ({
        url: `${EXAMS_URL}/exam/${examId}`,
        method: 'POST',
        credentials: 'include',
      }),
    }),

    // Search the centralized question bank by department/topic/difficulty
    getQuestionBank: builder.query({
      query: (params = {}) => {
        const search = new URLSearchParams(params).toString();
        return {
          url: `${EXAMS_URL}/exam/questions/bank/search${search ? `?${search}` : ''}`,
          method: 'GET',
        };
      },
    }),
  }),
});

// Export the generated hooks for each endpoint
export const {
  useGetExamsQuery,
  useGetExamByIdQuery,
  useCreateExamMutation,
  useGetQuestionsQuery,
  useCreateQuestionMutation,
  useDeleteExamMutation,
  useGetQuestionBankQuery,
} = examApiSlice;

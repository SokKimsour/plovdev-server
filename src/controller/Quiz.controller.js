const { Quiz, QuizQuestion, QuizAttempt, Certificate, course_progress , courses, sections } = require('../models');
const AppError = require('../utils/appError');
const { v4: uuidv4 } = require('uuid');

// Create a Quiz
const createQuiz = async (req, res) => {
  const { courseId } = req.params;
  const { title, sectionId } = req.body;

  if (!title) {
    throw new AppError('Quiz title is required!', 400);
  }

  const quiz = await Quiz.create({
    title,
    courseId,
    sectionId: sectionId || null, // null indicates a final course assessment quiz
  });

  // Create Then Fetch Pattern
  const newQuiz = await Quiz.findOne({
    where: { id: quiz.id },
    include : [
      {
        model : sections , as : "section"
      }
    ]
  });

  res.status(201).json({
    message: 'Quiz created successfully',
    data: newQuiz,
  });
};

// Add Questions to Quiz
const addQuestions = async (req, res) => {
  const { quizId } = req.params;
  const { questions } = req.body;
  const teacherId = req.user.id

  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    throw new AppError('An array of questions is required!', 400);
  }

  const quiz = await Quiz.findByPk(quizId);
  if (!quiz) {
    throw new AppError('Quiz not found!', 404);
  }

  const course = await courses.findByPk(quiz.courseId) ;
  if (!course) {
    throw new AppError("Course not found!", 400)
  }
  
  if (req.user.role !== 'admin' && course.teacherId !== teacherId) {
    throw new AppError("You do not have permission to add questions to this course", 403)
  }

  const formattedQuestions = questions.map((q, index) => ({
    question: q.question,
    options: q.options, // Extracted directly as JSONB objects
    correct_answer: q.correct_answer,
    explanation: q.explanation,
    position: q.position ? parseInt(q.position) : index + 1,
    quizId,
  }));

  await QuizQuestion.bulkCreate(formattedQuestions);

  const createdQuestions = await QuizQuestion.findAll({
    where: { quizId },
    order: [['position', 'ASC']],
  });

  res.status(201).json({
    message: 'Questions added successfully',
    data: createdQuestions,
  });
};

// Process Quiz Attempt
const attemptQuiz = async (req, res) => {
  const { quizId } = req.params;
  const { answers } = req.body; // Map structure: { "questionId": "answer_string" }
  const userId = req.user.id;

  const quiz = await Quiz.findByPk(quizId);
  if (!quiz) {
    throw new AppError('Quiz not found!', 404);
  }

  const questions = await QuizQuestion.findAll({ where: { quizId } });
  if (questions.length === 0) {
    throw new AppError('Quiz has no operational questions!', 400);
  }

  let correctCount = 0;
  questions.forEach((q) => {
    const studentAnswer = answers[q.id];
    if (studentAnswer && studentAnswer === q.correct_answer) {
      correctCount++;
    }
  });

  const scorePercentage = (correctCount / questions.length) * 100;
  const passed = scorePercentage >= 70; // Hardcoded 70% passing threshold constraint

  const attempt = await QuizAttempt.create({
    answers,
    passed,
    attempt_at: new Date(),
    userId,
    quizId,
  });

  // Automated Certificate Generation Workflow
  let certificate = null;
  if (passed && quiz.sectionId === null) {
    const progress = await course_progress.findOne({
      where: { userId, courseId: quiz.courseId },
    });

    // Check if progress parameters reveal full course completion (100%)
    if (progress && (progress.is_completed || parseFloat(progress.percentage) >= 1)) {
      const existingCert = await Certificate.findOne({
        where: { userId, courseId: quiz.courseId },
      });

      if (!existingCert) {
        certificate = await Certificate.create({
          verification_id: uuidv4(),
          issued_at: new Date(),
          userId,
          courseId: quiz.courseId,
        });
      } else {
        certificate = existingCert;
      }
    }
  }

  res.status(201).json({
    message: 'Quiz attempt processed successfully',
    data: {
      attempt,
      scorePercentage,
      passed,
      certificateGenerated: !!certificate,
      certificate,
    },
  });
};

// Get My Quiz Attempts
const getMyAttempts = async (req, res, next) => {
  const { quizId } = req.params;
  const userId = req.user.id;

  const attempts = await QuizAttempt.findAll({
    where: { quizId, userId },
    order: [['attempt_at', 'DESC']],
  });

  res.status(200).json({
    message: 'Attempts retrieved successfully',
    data: attempts,
  });
};

module.exports = {
  createQuiz,
  addQuestions,
  attemptQuiz,
  getMyAttempts,
};
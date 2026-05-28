const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
  createQuiz,
  addQuestions,
  attemptQuiz,
  getMyAttempts,
} = require('../controller/Quiz.controller');

// Create a quiz for a course
router.post('/courses/:courseId/quizzes', /* #swagger.tags = ['Quizzes'] */ authenticateToken, createQuiz);
// Add questions to a quiz
router.post('/quizzes/:quizId/questions', /* #swagger.tags = ['Quizzes'] */ authenticateToken, addQuestions);
// Attempt a quiz
router.post('/quizzes/:quizId/attempt', /* #swagger.tags = ['Quizzes'] */ authenticateToken, attemptQuiz);
// Get my quiz attempts
router.get('/quizzes/:quizId/attempts/me', /* #swagger.tags = ['Quizzes'] */ authenticateToken, getMyAttempts);

module.exports = router;

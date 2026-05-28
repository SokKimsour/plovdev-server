const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/authMiddleware');
const {
  toggleLessonProgress,
  getMyCourseProgress,
  getCompletedLessons,
} = require('../controller/CourseProgress.controller');

// Toggle a lesson as complete / incomplete
router.patch(
  '/courses/:courseId/lessons/:lessonId/progress/toggle',
  /* #swagger.tags = ['Course Progress'] */ authenticateToken,
  toggleLessonProgress
);
// Get the authenticated user's overall progress for a course
router.get(
  '/courses/:courseId/progress/me',
  /* #swagger.tags = ['Course Progress'] */ authenticateToken,
  getMyCourseProgress
);
// Get all completed lessons for the authenticated user in a course
router.get(
  '/courses/:courseId/progress/lessons',
  /* #swagger.tags = ['Course Progress'] */ authenticateToken,
  getCompletedLessons
);

module.exports = router;

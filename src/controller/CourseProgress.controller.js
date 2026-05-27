const { Op } = require('sequelize');
const { LessonProgress, course_progress, lessons, sections, enrollments } = require('../models');
const AppError = require('../utils/appError');

// ─── Toggle Lesson Completion ───────────────────────────────────────────────
// PATCH /courses/:courseId/lessons/:lessonId/progress/toggle
const toggleLessonProgress = async (req, res) => {
  const { courseId, lessonId } = req.params;
  const userId = req.user.id;

  // 1. Guard: user must be enrolled in the course
  const enrollment = await enrollments.findOne({ where: { userId, courseId } });
  if (!enrollment) {
    throw new AppError('You are not enrolled in this course.', 403);
  }

  // 2. Guard: lesson must exist and belong to this course (via section)
  const lesson = await lessons.findOne({
    where: { id: lessonId },
    include: [{ model: sections, as: 'section', where: { courseId }, attributes: ['id'] }],
  });
  if (!lesson) {
    throw new AppError('Lesson not found in this course.', 404);
  }

  // 3. Find existing lesson progress or create a new one
  let lessonProgress = await LessonProgress.findOne({ where: { userId, lessonId } });

  if (!lessonProgress) {
    lessonProgress = await LessonProgress.create({
      userId,
      lessonId,
      is_complete: false,
      last_position_secs: 0,
      completedAt: null,
    });
  }

  // 4. Toggle the completion state
  const newState = !lessonProgress.is_complete;
  await lessonProgress.update({
    is_complete: newState,
    completedAt: newState ? new Date() : null,
  });

  // 5. Recalculate course progress ─────────────────────────────────────────
  // Count total lessons in this course (via sections)
  const courseSections = await sections.findAll({
    where: { courseId },
    attributes: ['id'],
  });
  const sectionIds = courseSections.map((s) => s.id);

  const totalLessons = await lessons.count({
    where: { sectionId: { [Op.in]: sectionIds } },
  });

  // Count lessons the user has completed in this course
  const completedLessons = await LessonProgress.count({
    where: {
      userId,
      is_complete: true,
      lessonId: {
        [Op.in]: await lessons.findAll({
          where: { sectionId: { [Op.in]: sectionIds } },
          attributes: ['id'],
        }).then((rows) => rows.map((r) => r.id)),
      },
    },
  });

  const percentage = totalLessons > 0 ? (completedLessons / totalLessons) : 0;
  const isCompleted = percentage >= 1;

  // 6. Find or create course_progress record, then update
  let courseProgress = await course_progress.findOne({ where: { userId, courseId } });

  if (!courseProgress) {
    courseProgress = await course_progress.create({
      userId,
      courseId,
      total_lessons: totalLessons,
      completed_lessons: completedLessons,
      percentage,
      is_completed: isCompleted,
      last_accessed: new Date(),
      complete_at: isCompleted ? new Date() : null,
      lastLessonId: lessonId,
    });
  } else {
    await courseProgress.update({
      total_lessons: totalLessons,
      completed_lessons: completedLessons,
      percentage,
      is_completed: isCompleted,
      last_accessed: new Date(),
      complete_at: isCompleted ? new Date() : courseProgress.complete_at,
      lastLessonId: lessonId,
    });
  }

  // 7. Re-fetch for clean response (Create Then Fetch pattern)
  const updatedProgress = await course_progress.findOne({
    where: { userId, courseId },
  });

  res.status(200).json({
    status: 'success',
    message: `Lesson marked as ${newState ? 'completed' : 'incomplete'}.`,
    data: {
      lessonProgress: {
        lessonId: Number(lessonId),
        is_complete: newState,
        completedAt: lessonProgress.completedAt,
      },
      courseProgress: updatedProgress,
    },
  });
};

// ─── Get My Course Progress ─────────────────────────────────────────────────
// GET /courses/:courseId/progress/me
const getMyCourseProgress = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  const progress = await course_progress.findOne({ where: { userId, courseId } });
  if (!progress) {
    throw new AppError('No progress record found for this course. Start a lesson first.', 404);
  }

  res.status(200).json({
    status: 'success',
    message: 'Course progress retrieved successfully.',
    data: progress,
  });
};

// ─── Get All Completed Lessons In Course ────────────────────────────────────
// GET /courses/:courseId/progress/lessons
const getCompletedLessons = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  // Resolve all lesson IDs for this course
  const courseSections = await sections.findAll({
    where: { courseId },
    attributes: ['id'],
  });
  const sectionIds = courseSections.map((s) => s.id);

  const courseLessons = await lessons.findAll({
    where: { sectionId: { [Op.in]: sectionIds } },
    attributes: ['id'],
  });
  const courseLessonIds = courseLessons.map((l) => l.id);

  const completedLessons = await LessonProgress.findAll({
    where: {
      userId,
      is_complete: true,
      lessonId: { [Op.in]: courseLessonIds },
    },
    order: [['completedAt', 'DESC']],
  });

  res.status(200).json({
    status: 'success',
    message: 'Completed lessons retrieved successfully.',
    data: completedLessons,
  });
};

module.exports = {
  toggleLessonProgress,
  getMyCourseProgress,
  getCompletedLessons,
};

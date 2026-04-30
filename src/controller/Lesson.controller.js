const { lessons, sections, courses } = require('../models');

const cloudinary = require('../config/cloudinary');
const { uploadVideoToCloudinary } = require('../utils/uploadToCloudinary');

// CREATE LESSON
const createLesson = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const { title, is_free_preview, position } = req.body;
    const teacherId = req.user.id;

    if (!title) {
      return res.status(400).json({ message: 'Lesson title is required!' });
    }

    const course = await courses.findOne({ where: { id: courseId, teacherId } });
    if (!course) {
      return res.status(404).json({ message: 'Course not found!' });
    }

    const section = await sections.findOne({ where: { id: sectionId, courseId } });
    if (!section) {
      return res.status(404).json({ message: 'Section not found!' });
    }

    let videoUrl = null;
    let videoPublicId = null;
    let duration_secs = 0;

    if (req.file) {
      const result = await uploadVideoToCloudinary(req.file.buffer, {
        folder: 'plovdev/videos',
        resource_type: 'video'
      });
      videoUrl = result.secure_url;
      videoPublicId = result.public_id;
      duration_secs = Math.round(result.duration || 0);
    }

    const lessonCount = await lessons.count({ where: { sectionId } });
    const newPosition = position ?? lessonCount + 1;

    const lesson = await lessons.create({
      title,
      videoUrl,
      videoPublicId,
      duration_secs,
      is_free_preview: is_free_preview === 'true' || is_free_preview === true,
      position: newPosition,
      sectionId
    });

    const lessonWithSection = await lessons.findOne({
      where: { id: lesson.id },
      include: [{
        model: sections,
        as: 'section',
        attributes: ['id', 'title']
      }]
    });

    res.status(201).json({ message: 'Lesson created successfully!', leslessonWithSectionson });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

// UPDATE LESSON
const updateLesson = async (req, res) => {
  try {
    const { courseId, sectionId, lessonId } = req.params;
    const { title, is_free_preview, position } = req.body;
    const teacherId = req.user.id;

    const course = await courses.findOne({ where: { id: courseId, teacherId } });
    if (!course) {
      return res.status(404).json({ message: 'Course not found!' });
    }

    const section = await sections.findOne({ where: { id: sectionId, courseId } });
    if (!section) {
      return res.status(404).json({ message: 'Section not found!' });
    }

    const lesson = await lessons.findOne({ where: { id: lessonId, sectionId } });
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found!' });
    }

    let videoUrl = lesson.videoUrl;
    let videoPublicId = lesson.videoPublicId;
    let duration_secs = lesson.duration_secs;

    if (req.file) {
      if (lesson.videoPublicId) {
        await cloudinary.uploader.destroy(lesson.videoPublicId, { resource_type: 'video' });
      }
      const result = await uploadVideoToCloudinary(req.file.buffer, {
        folder: 'plovdev/videos',
        resource_type: 'video'
      });
      videoUrl = result.secure_url;
      videoPublicId = result.public_id;
      duration_secs = Math.round(result.duration || 0);
    }

    await lesson.update({
      title: title || lesson.title,
      videoUrl,
      videoPublicId,
      duration_secs,
      is_free_preview: is_free_preview !== undefined
        ? (is_free_preview === 'true' || is_free_preview === true)
        : lesson.is_free_preview,
      position: position ?? lesson.position
    });

    res.json({ message: 'Lesson updated successfully!', lesson });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

// DELETE LESSON
const deleteLesson = async (req, res) => {
  try {
    const { courseId, sectionId, lessonId } = req.params;
    const teacherId = req.user.id;

    const course = await courses.findOne({ where: { id: courseId, teacherId } });
    if (!course) {
      return res.status(404).json({ message: 'Course not found!' });
    }

    const section = await sections.findOne({ where: { id: sectionId, courseId } });
    if (!section) {
      return res.status(404).json({ message: 'Section not found!' });
    }

    const lesson = await lessons.findOne({ where: { id: lessonId, sectionId } });
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found!' });
    }

    if (lesson.videoPublicId) {
      await cloudinary.uploader.destroy(lesson.videoPublicId, { resource_type: 'video' });
    }

    await lesson.destroy();

    res.json({ message: 'Lesson deleted successfully!' });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

// GET LESSONS FOR A SECTION
const getLessons = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;

    const section = await sections.findOne({ where: { id: sectionId, courseId } });
    if (!section) {
      return res.status(404).json({ message: 'Section not found!' });
    }

    const allLessons = await lessons.findAll({
      where: { sectionId },
      order: [['position', 'ASC']]
    });

    res.json({ message: 'Lessons retrieved successfully!', lessons: allLessons });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

// GET LESSON BY ID (teacher only - includes videoUrl)
const getLessonById = async (req, res) => {
  try {
    const { sectionId, lessonId } = req.params;

    const lesson = await lessons.findOne({ where: { id: lessonId, sectionId } });
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found!' });
    }

    res.json({ message: 'Lesson retrieved successfully!', lesson });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

module.exports = { 
    createLesson, 
    updateLesson,
    deleteLesson, 
    getLessons,
    getLessonById 
};
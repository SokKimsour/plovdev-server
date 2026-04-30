const { sections, lessons, courses } = require('../models');

// CREATE SECTION FOR COURSE
const createSection = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, position } = req.body;
    const teacherId = req.user.id;

    if (!title) {
      return res.status(400).json({ message: 'Section title is required!' });
    }

    const course = await courses.findOne({ where: { id: courseId, teacherId } });
    if (!course) {
      return res.status(404).json({ message: 'Course not found!' });
    }

    const sectionCount = await sections.count({ where: { courseId } });
    const newPosition = position ?? sectionCount + 1;

    const section = await sections.create({ title, position: newPosition, courseId });

    const sectionWithCourse = await sections.findOne({
      where: { id: section.id },
      include: [{
        model: courses,
        as: 'course',
        attributes: ['id', 'title']
      }]
    });

    res.status(201).json({ message: 'Section created successfully!', sectionWithCourse });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};


// UPDATE SECTION
const updateSection = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const { title, position } = req.body;
    const teacherId = req.user.id;

    const course = await courses.findOne({ where: { id: courseId, teacherId } });
    if (!course) {
      return res.status(404).json({ message: 'Course not found!' });
    }

    const section = await sections.findOne({ where: { id: sectionId, courseId } });
    if (!section) {
      return res.status(404).json({ message: 'Section not found!' });
    }

    await section.update({
      title: title ?? section.title,
      position: position ?? section.position
    });

    const sectionWithCourse = await sections.findOne({
    where: { id: section.id },
    include: [{
        model: courses,
        as: 'course',
        attributes: ['id', 'title']
      }]
    });


    res.json({ message: 'Section updated successfully!', sectionWithCourse });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};


// DELETE SECTION AND ITS LESSONS
const deleteSection = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const teacherId = req.user.id;

    const course = await courses.findOne({ where: { id: courseId, teacherId } });
    if (!course) {
      return res.status(404).json({ message: 'Course not found!' });
    }

    const section = await sections.findOne({ where: { id: sectionId, courseId } });
    if (!section) {
      return res.status(404).json({ message: 'Section not found!' });
    }

    await lessons.destroy({ where: { sectionId } });
    await section.destroy();

    res.json({ message: 'Section and its lessons deleted successfully!' });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

// GET ALL SECTIONS WITH LESSONS FOR A COURSE
const getSections = async (req, res) => {
  try { 
    const { courseId } = req.params;

    const course = await courses.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found!' });
    }

    const allSections = await sections.findAll({
      where: { courseId },
      order: [['position', 'ASC']],
      include: [{
        model: lessons,
        as: 'lessons',
        attributes: ['id', 'title', 'duration_secs', 'is_free_preview', 'position'],
        order: [['position', 'ASC']]
      }]
    });

    res.json({ message: 'Sections retrieved successfully!', sections: allSections });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};


module.exports = {
  createSection,
  updateSection,
  deleteSection,
  getSections
}
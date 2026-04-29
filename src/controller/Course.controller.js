const { Users, courses } = require("../models");

const createCourse = async (req, res) => {
  try {
    const teacherId = req.user.id;

    // CHECK IF USER IS TEACHER
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only teachers can create a course!" });
    }

    const { title_en, description, price } = req.body;

    // VALIDATE REQUIRED FIELDS
    if (!title_en) {
      return res.status(400).json({ message: "Course title is required!" });
    }

    // UPLOAD THUMBNAIL TO CLOUDINARY
    let thumbnailUrl = null;
    let thumbnailPublicId = null;

    if (req.file) {
      const result = await uploadBufferImageToCloudinary(req.file.buffer, {
        folder: "plovdev/thumbnails",
        resource_type: "image",
      });
      thumbnailUrl = result.secure_url;
      thumbnailPublicId = result.public_id;
    }

    // CREATE COURSE
    const course = await courses.create({
      title_en,
      description,
      thumbnailUrl,
      thumbnailPublicId,
      price: price || 0,
      is_published: false,
      teacherId,
    });

    res.status(201).json({
      message: "Course created successfully!",
      course,
    });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

// COURSE FOR STUDENTS
const viewCourse = async (req, res) => {
  try {
    const courses = await courser.findAll({
      include: [
        {
          models: Users,
          as: "teacher",
        },
      ],
    });

    res.json({ message: "Courses retrieved successfully!", courses });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

const viewCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await courses.findByPk(courseId, {
      include: [
        {
          models: Users,
          as: "teacher",
        },
      ],
    });

    res.json({ message: "Course retrieved successfully!", course });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};





module.exports = {
  createCourse,
  viewCourse,
  viewCourseById,
};

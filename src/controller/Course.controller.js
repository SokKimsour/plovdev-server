const { Users, courses } = require("../models");
const {
  uploadBufferImageToCloudinary,
} = require("../utils/uploadToCloudinary");

const cloudinary = require("../config/cloudinary");

const createCourse = async (req, res) => {
  try {
    const teacherId = req.user.id;

    // CHECK IF USER IS TEACHER
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only teachers can create a course!" });
    }

    const { title_en, description, price, original_price, what_you_learn } =
      req.body;

      // parse to float
    const parsedPrice = price ? parseFloat(price) : 0
    const parsedOriginalPrice = original_price ? parseFloat(original_price) : 0

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
      what_you_learn: what_you_learn ,
      thumbnailUrl,
      thumbnailPublicId,
      price: parsedPrice,
      original_price: parsedOriginalPrice,
      is_published: false,
      teacherId,
    });

    // FETCH CREATED COURSE WITH TEACHER DATA
    const courseWithTeacher = await courses.findOne({
      where: { teacherId, title_en },
      include: [
        {
          model: Users,
          as: "teacher",
          attributes: ["id", "fullName", "userName"],
        },
      ],
    });

    res.status(201).json({
      message: "Course created successfully!",
      course: courseWithTeacher,
    });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

// UPDATE COURSE
const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user.id;

    // CHECK IF USER IS TEACHER
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only teachers can update a course!" });
    }

    // FIND COURSE
    const course = await courses.findOne({
      where: { id: courseId, teacherId },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    const { title_en, description, price, what_you_learn, original_price } =
      req.body;

            // parse to float
    const parsedPrice = price ? parseFloat(price) : 0
    const parsedOriginalPrice = original_price ? parseFloat(original_price) : 0


    // HANDLE THUMBNAIL UPDATE
    let thumbnailUrl = course.thumbnailUrl;
    let thumbnailPublicId = course.thumbnailPublicId;

    if (req.file) {
      // DELETE OLD THUMBNAIL FROM CLOUDINARY
      if (course.thumbnailPublicId) {
        await cloudinary.uploader.destroy(course.thumbnailPublicId);
      }

      // UPLOAD NEW THUMBNAIL
      const result = await uploadBufferImageToCloudinary(req.file.buffer, {
        folder: "plovdev/thumbnails",
        resource_type: "image",
      });
      thumbnailUrl = result.secure_url;
      thumbnailPublicId = result.public_id;
    }

    // UPDATE COURSE
    await course.update({
      title_en: title_en || course.title_en,
      description: description || course.description,
      price: parsedPrice,
      original_price: parsedOriginalPrice,
      what_you_learn: what_you_learn || course.what_you_learn,
      thumbnailUrl,
      thumbnailPublicId,
    });

    res.json({
      message: "Course updated successfully!",
      course,
    });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

// COURSE FOR STUDENTS
const viewCourse = async (req, res) => {
  try {
    const allCourses = await courses.findAll({
      include: [
        {
          model: Users,
          as: "teacher",
          attributes: ["id", "fullName", "userName"],
        },
      ],
    });

    res.json({
      message: "Courses retrieved successfully!",
      courses: allCourses,
    });
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
          model: Users,
          as: "teacher",
          attributes: ["id", "fullName", "userName"],
        },
      ],
    });

    res.json({ message: "Course retrieved successfully!", course });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

// DELETE COURSE
const deleteCourse = async (req, res) => {
  try {
    const teacherId = req.user.id
    const { courseId } = req.params

    // CHECK IF USER IS TEACHER OR ADMIN
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only teachers or admin can delete a course!' })
    }

    // FIND COURSE
    const course = await courses.findOne({
      where: req.user.role === 'admin' 
        ? { id: courseId }           // admin can delete any course
        : { id: courseId, teacherId } // teacher can only delete their own
    })

    if (!course) {
      return res.status(404).json({ message: 'Course not found!' })
    }

    // DELETE THUMBNAIL FROM CLOUDINARY
    if (course.thumbnailPublicId) {
      await cloudinary.uploader.destroy(course.thumbnailPublicId)
    }

    // DELETE COURSE
    await course.destroy()

    res.json({ message: 'Course deleted successfully!' })

  } catch (error) {
    res.status(500).json({ messageError: error.message })
  }
}

// PUBLISH COURSE
const publishCourse = async (req, res) => {
  try {
    const teacherId = req.user.id
    const { courseId } = req.params

    // CHECK IF USER IS TEACHER
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can publish a course!' })
    }

    // FIND COURSE
    const course = await courses.findOne({
      where: { id: courseId, teacherId }
    })

    if (!course) {
      return res.status(404).json({ message: 'Course not found!' })
    }

    // TOGGLE PUBLISH STATUS
    await course.update({
      is_published: !course.is_published
    })

    res.json({
      message: course.is_published ? 'Course published successfully!' : 'Course unpublished successfully!',
      is_published: course.is_published
    })

  } catch (error) {
    res.status(500).json({ messageError: error.message })
  }
}

//GET ALL COURSES FOR TEACHER
const getTeacherCourses = async (req, res) => {
  try {
    const teacherId = req.user.id

    // CHECK IF USER IS TEACHER
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Only teachers can view their courses!' })
    }

    const teacherCourses = await courses.findAll({
      where: { teacherId },
      include: [{
        model: Users,
        as: 'teacher',
        attributes: ['id', 'fullName', 'userName']
      }]
    })

    res.json({
      message: 'Teacher courses retrieved successfully!',
      total: teacherCourses.length,
      courses: teacherCourses
    })

  } catch (error) {
    res.status(500).json({ messageError: error.message })
  }
}

// VIEW COURSE FOR STUDENT
const viewCourseContent = async (req, res) => {
  try {
    const { courseId } = req.params
    const userId = req.user.id

    const course = await courses.findOne({
      where: { id: courseId, is_published: true },
      include: [
        {
          model: Users,
          as: 'teacher',
          attributes: ['id', 'fullName', 'userName']
        },
        {
          model: sections,
          as: 'sections',
          include: [
            {
              model: lessons,
              as: 'lessons',
              attributes: ['id', 'title', 'duration_secs', 'is_free_preview', 'position']
              // videoUrl is NOT included here for security
            }
          ]
        }
      ]
    })

    if (!course) {
      return res.status(404).json({ message: 'Course not found!' })
    }

    res.json({
      message: 'Course content retrieved successfully!',
      course
    })

  } catch (error) {
    res.status(500).json({ messageError: error.message })
  }
}

module.exports = {
  createCourse,
  viewCourse,
  viewCourseById,
  updateCourse,
  deleteCourse,
  publishCourse ,
  getTeacherCourses,
  viewCourseContent
};

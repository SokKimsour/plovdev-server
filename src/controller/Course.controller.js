const { Users, courses , sections , lessons ,categories  , course_categories} = require("../models");
const {
  uploadBufferImageToCloudinary,
} = require("../utils/uploadToCloudinary");

const cloudinary = require("../config/cloudinary");

const createCourse = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const { title_en, description, price, original_price, what_you_learn , category_id} =
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
        format : "webp"
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
      status : "draft" ,
      teacherId,
    });

     if (category_id) {
      await course_categories.create({
        courseId: course.id,
        categoryId: parseInt(category_id)
      })
    }

    // FETCH CREATED COURSE WITH TEACHER DATA
    const courseWithTeacher = await courses.findOne({
      where: {id : course.id },
      include: [
        {
          model: Users,
          as: "teacher",
          attributes: ["id", "fullName", "userName"],
        },
        {
          model: categories,
          as: 'category',
          attributes: ['id', 'name', 'iconUrl'],
          through: { attributes: [] }
        }
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

    // FIND COURSE
    const course = await courses.findOne({
      where: { id: courseId, teacherId },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

    const { title_en, description, price, what_you_learn, original_price ,category_id} =
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
        format : "webp"
      });
      thumbnailUrl = result.secure_url;
      thumbnailPublicId = result.public_id;
    }

    // UPDATE COURSE
    await course.update({
      title_en: title_en ?? course.title_en,
      description: description ?? course.description,
      price: parsedPrice,
      original_price: parsedOriginalPrice,
      what_you_learn: what_you_learn ?? course.what_you_learn,
      thumbnailUrl,
      thumbnailPublicId,
    });

      if (category_id) {
        await course_categories.destroy({ where: { courseId: course.id } });
        await course_categories.create({
          courseId: course.id,
          categoryId: parseInt(category_id)
        });
      }

      const courseWithTeacher = await courses.findOne({
      where: {id : course.id },
      include: [
        {
          model: Users,
          as: "teacher",
          attributes: ["id", "fullName", "userName"],
        },
        {
          model: categories,
          as: 'category',
          attributes: ['id', 'name', 'iconUrl'],
          through: { attributes: [] }
        }
      ],
    });

    res.json({
      message: "Course updated successfully!",
      course : courseWithTeacher,
    });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

// COURSE FOR STUDENTS
const viewCourse = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: allCourses } = await courses.findAndCountAll({
      // where: { status: 'published' },
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true,  //  needed with include to get correct count
      include: [
        {
          model: Users,
          as: 'teacher',
          attributes: ['id', 'fullName', 'userName']
        },
        {
          model: categories,
          as: 'category',
          attributes: ['id', 'name', 'iconUrl'],
          through: { attributes: [] }
        },
        {
          model: sections,
          as: 'sections',
          attributes: ['id', 'title', 'position'],
          separate: true,  // ← reliable ordering
          order: [['position', 'ASC']],
          include: [{
            model: lessons,
            as: 'lessons',
            attributes: ['id', 'title', 'duration_secs', 'is_free_preview', 'position'],
            separate: true,
            order: [['position', 'ASC']]
          }]
        }
      ]
    });

    res.json({
      message: "Courses retrieved successfully!",
      total: count,
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      courses: allCourses
    });

  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

const viewCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await courses.findOne({
      where: { id: courseId },
      include: [
        {
          model: Users,
          as: 'teacher',
          attributes: ['id', 'fullName', 'userName']
        },
        {
          model: categories,
          as: 'category',
          attributes: ['id', 'name', 'iconUrl'],
          through: { attributes: [] }
        },
        {
          model: sections,
          as: 'sections',
          attributes: ['id', 'title', 'position'],
          separate: true,
          order: [['position', 'ASC']],
          include: [{
            model: lessons,
            as: 'lessons',
            attributes: ['id', 'title', 'duration_secs', 'is_free_preview', 'position'],
            separate: true,
            order: [['position', 'ASC']]
          }]
        }
      ]
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found!" });
    }

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

    // FIND COURSE
    const course = await courses.findOne({
      where: req.user.role === 'admin'
        ? { id: courseId }
        : { id: courseId, teacherId }
    })

    if (!course) {
      return res.status(404).json({ message: 'Course not found!' })
    }

    // DELETE ALL LESSON VIDEOS FROM CLOUDINARY
    const allSections = await sections.findAll({ where: { courseId } })
    for (let section of allSections) {
      const allLessons = await lessons.findAll({ where: { sectionId: section.id } })
      for (let lesson of allLessons) {
        if (lesson.videoPublicId) {
          await cloudinary.uploader.destroy(lesson.videoPublicId, { resource_type: 'video' })
        }
      }
    }

    // DELETE THUMBNAIL FROM CLOUDINARY
    if (course.thumbnailPublicId) {
      await cloudinary.uploader.destroy(course.thumbnailPublicId)
    }

    // DELETE COURSE (CASCADE deletes sections and lessons from DB)
    await course.destroy()

    res.json({ message: 'Course deleted successfully!' })

  } catch (error) {
    res.status(500).json({ messageError: error.message })
  }
}

// PUBLISH COURSE , ADMIN APPROVE FIRST BEFORE PUBLISH THE COURSE
const submitCourse = async (req, res) => {
  try {
    const teacherId = req.user.id // declare as a teacher easy to understand
    const { courseId } = req.params

    // FIND COURSE
    const course = await courses.findOne({
      where: { id: courseId, teacherId }
    })

    if (!course) {
      return res.status(404).json({ message: 'Course not found!' })
    }

    // VALIDATE THE SECTIONS
    const sections = await sections.count({where : {courseId}})
    if (sections === 0) {
      return res.status(400).json({
        message : "Please add at least one section before submitting the course!"
      })
    }

    // TOGGLE PUBLISH STATUS
    await course.update({
      status : "pending review"
    })

    res.json({ message: 'Course submitted for review successfully!' })

  } catch (error) {
    res.status(500).json({ messageError: error.message })
  }
}

// GET ALL COURSES FOR TEACHER
const getTeacherCourses = async (req, res) => {
  try {
    const teacherId = req.user.id

    const teacherCourses = await courses.findAll({
      where: { teacherId },
      include: [{
        model: Users,
        as: 'teacher',
        attributes: ['id', 'fullName', 'userName']
      },
      {
        model : categories , 
        as : "category" , attributes : ["id" , "name" , "iconUrl"],
        through : {attributes : []}
      }
    ]
    })

    res.json({
      message: 'Teacher courses retrieved successfully!',
      total: teacherCourses.length,
      courses: teacherCourses
    })
  
  } catch (error) {
    return res.status(500).json(error.message)
  }
}


// FOR TEACHER WHO WANT TO UPDATE THEIR COUSE 
const getTeacherCoursesById = async (req, res) => {
  try {
    const teacherId = req.user.id
    const {courseId} = req.params

    const teacherCourses = await courses.findOne({
      where: { teacherId , id : courseId },
      include: [{
        model: Users,
        as: 'teacher',
        attributes: ['id', 'fullName', 'userName']
      },
      {
        model : categories , 
        as : "category" , attributes : ["id" , "name" , "iconUrl"],
        through : {attributes : []}
      }
    ]
    })

    res.json({
      message: 'Teacher courses retrieved successfully!',
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
      where: { id: courseId, status : "published" },
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


// ARCHIEVED COURSE
// need this for teacher to archive published course
const archiveCourse = async (req, res) => {
  try {
    const { courseId } = req.params
    const teacherId = req.user.id

    const course = await courses.findOne({
      where: { id: courseId, teacherId }
    })

    if (!course) {
      return res.status(404).json({ message: 'Course not found!' })
    }

    if (course.status !== 'published') {
      return res.status(400).json({ message: 'Only published courses can be archived!' })
    }

    await course.update({
      status: 'archived',
      archivedAt: new Date()
    })

    res.json({ message: 'Course archived successfully!' })

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
  submitCourse ,
  getTeacherCourses,
  getTeacherCoursesById,
  viewCourseContent,
  archiveCourse
};

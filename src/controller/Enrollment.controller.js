const { sequelize, enrollments, courses, Users, course_progress } = require("../models");
const AppError = require("../utils/appError");

// GET STUDENT'S ENROLLED COURSES WITH PROGRESS
const getMyEnrolledCourses = async (req, res) => {
    const userId = req.user.id;

    const userEnrollments = await enrollments.findAll({
        where: { userId },
        include: [
            {
                model: courses,
                as: "course",
                include: [
                    {
                        model: Users,
                        as: "teacher",
                        attributes: ["id", "fullName", "userName"]
                    },
                    {
                        model: course_progress,
                        as: "course_progress",
                        where: { userId },
                        required: false // in case progress hasn't been instantiated yet
                    }
                ]
            }
        ],
        order: [["enrollmentAt", "DESC"]]
    });

    res.status(200).json({
        status: "success",
        message: "Enrolled courses retrieved successfully",
        data: userEnrollments
    });
};

// GET ALL ENROLLMENTS FOR ADMIN
const getAllEnrollments = async (req, res) => {
    const allEnrollments = await enrollments.findAll({
        include: [
            {
                model: Users,
                as: "user",
                attributes: { exclude: ["password"] }
            },
            {
                model: courses,
                as: "course",
                attributes: ["id", "title_en", "price", "status"]
            }
        ],
        order: [["enrollmentAt", "DESC"]]
    });

    res.status(200).json({
        status: "success",
        message: "All enrollments retrieved successfully",
        data: allEnrollments
    });
};

module.exports = {
    getMyEnrolledCourses,
    getAllEnrollments
};

const cloudinary = require("../config/cloudinary");
const {
  Users,
  OtpCode,
  teacher_profiles,
  student_profiles,
} = require("../models");
const {
  uploadBufferImageToCloudinary,
} = require("../utils/uploadToCloudinary");

const createStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is not found!" });
    }

    const { bio, github_url } = req.body;

    const existingProfile = await student_profiles.findOne({
      where: { userId },
    });

    if (existingProfile) {
      return res
        .status(400)
        .json({ message: "Student profile already exists for this user!" });
    }

    // UPLOAD PROFILE PICTURE TO CLOUDINARY
    let profileUrl = null;
    let profilePublicId = null;
    if (req.file) {
      const result = await uploadBufferImageToCloudinary(req.file.buffer, {
        folder: "plovdev/profiles",
        resource_type: "image",
      });
      profileUrl = result.secure_url;
      profilePublicId = result.public_id;
    }

    await student_profiles.create({
      profileUrl,
      profilePublicId,
      bio,
      github_url,
      userId,
    });

    const studentProfile = await student_profiles.findOne({
      where: { userId },
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id", "userName", "email", "gender", "is_verified"],
        },
      ],
    });

    res.status(201).json({
      message: "Student profile created successfully!",
      studentProfile,
    });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

// UPDATE STUDENT PROFILE
const updateStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // CHECK IF PROFILE EXISTS
    const studentProfile = await student_profiles.findOne({
      where: { userId },
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id", "userName", "email", "gender", "is_verified"],
        },
      ],
    });

    if (!studentProfile) {
      return res.status(404).json({ message: "Student profile not found!" });
    }

    const { bio, github_url } = req.body;

    // HANDLE PROFILE IMAGE UPDATE
    let profileUrl = studentProfile.profileUrl;
    let profilePublicId = studentProfile.profilePublicId;

    if (req.file) {
      // DELETE OLD IMAGE FROM CLOUDINARY FIRST
      if (studentProfile.profilePublicId) {
        await cloudinary.uploader.destroy(studentProfile.profilePublicId);
      }

      // UPLOAD NEW IMAGE
      const result = await uploadBufferImageToCloudinary(req.file.buffer, {
        folder: "plovdev/profiles",
        resource_type: "image",
      });
      profileUrl = result.secure_url;
      profilePublicId = result.public_id;
    }

    // UPDATE PROFILE
    await studentProfile.update({
      bio,
      profileUrl,
      profilePublicId,
    });

    res.json({
      message: "Student profile updated successfully!",
      studentProfile,
    });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

// GET STUDENT PROFILE
const getStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const studentProfile = await student_profiles.findOne({
      where: { userId },
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id", "userName", "email", "gender", "is_verified"],
        },
      ],
    });

    if (!studentProfile) {
      return res.status(404).json({ message: "Student profile not found!" });
    }

    res.json({
      message: "Student profile retrieved successfully!",
      studentProfile,
    });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

const getStudentProfileById = async (req, res) => {
  try {
    const { userId } = req.params;

    const studentProfile = await student_profiles.findOne({
      where: { userId },
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id", "userName", "email", "gender", "is_verified"],
        },
      ],
    });

    if (!studentProfile) {
      return res.status(404).json({ message: "Student profile not found!" });
    }

    res.json({
      message: "Student profile retrieved successfully!",
      studentProfile,
    });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

module.exports = {
  createProfile: createStudentProfile,
  updateStudentProfile,
  getStudentProfile,
  getStudentProfileById,
};

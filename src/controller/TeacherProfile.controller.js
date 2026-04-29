const cloudinary = require("../config/cloudinary");
const { Users, OtpCode, teacher_profiles } = require("../models");
const {
  uploadBufferImageToCloudinary,
} = require("../utils/uploadToCloudinary");

const createTeacherProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is not found!" });
    }

    const { bio, yearsExp, payoutAccount, commissionRate = 0.4 } = req.body;

    const existingProfile = await teacher_profiles.findOne({
      where: { userId },
    });

    if (existingProfile) {
      return res
        .status(400)
        .json({ message: "Teacher profile already exists for this user!" });
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

    await teacher_profiles.create({
      profileUrl,
      profilePublicId,
      bio,
      yearsExp,
      payoutAccount,
      commissionRate,
      userId,
    });

    const teacherProfile = await teacher_profiles.findOne({
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
      message: "Teacher profile created successfully!",
      teacherProfile,
    });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

// UPDATE TEACHER PROFILE
const updateTeacherProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // CHECK IF PROFILE EXISTS
    const teacherProfile = await teacher_profiles.findOne({
      where: { userId },
    });
    if (!teacherProfile) {
      return res.status(404).json({ message: "Teacher profile not found!" });
    }

    const { bio, yearsExp, payoutAccount } = req.body;

    // HANDLE PROFILE IMAGE UPDATE
    let profileUrl = teacherProfile.profileUrl;
    let profilePublicId = teacherProfile.profilePublicId;

    if (req.file) {
      // DELETE OLD IMAGE FROM CLOUDINARY FIRST
      if (teacherProfile.profilePublicId) {
        await cloudinary.uploader.destroy(teacherProfile.profilePublicId);
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
    await teacherProfile.update({
      bio,
      yearsExp,
      payoutAccount,
      profileUrl,
      profilePublicId,
    });

    res.json({
      message: "Teacher profile updated successfully!",
      teacherProfile,
    });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

// GET TEACHER PROFILE
const getTeacherProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const teacherProfile = await teacher_profiles.findOne({
      where: { userId },
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id", "userName", "email", "gender", "is_verified"],
        },
      ],
    });

    if (!teacherProfile) {
      return res.status(404).json({ message: "Teacher profile not found!" });
    }

    res.json({
      message: "Teacher profile retrieved successfully!",
      teacherProfile,
    });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

const getTeacherProfileById = async (req, res) => {
  try {
    const { userId } = req.params;

    const teacherProfile = await teacher_profiles.findOne({
      where: { userId },
    });

    if (!teacherProfile) {
      return res.status(404).json({ message: "Teacher profile not found!" });
    }

    res.json({
      message: "Teacher profile retrieved successfully!",
      teacherProfile,
    });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

module.exports = {
  createProfile: createTeacherProfile,
  updateTeacherProfile,
  getTeacherProfile,
  getTeacherProfileById,
};

const cloudinary = require("../config/cloudinary");
const { Users, OtpCode, user_profiles } = require("../models");
const {
  uploadBufferImageToCloudinary,
} = require("../utils/uploadToCloudinary");

const createUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is not found!" });
    }

    const { bio, yearsExp, payoutAccount, commissionRate = 0.4 , github_url} = req.body;

    const existingProfile = await user_profiles.findOne({
      where: { userId },
    });

    if (existingProfile) {
      return res
        .status(400)
        .json({ message: "User profile already exists for this user!" });
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

    await user_profiles.create({
      profileUrl,
      profilePublicId,
      bio,
      yearsExp,
      payoutAccount,
      commissionRate,
      github_url,
      userId,
    });

    const userProfile = await user_profiles.findOne({
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
      message: "User profile created successfully!",
      userProfile,
    });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

// UPDATE User PROFILE
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // CHECK IF PROFILE EXISTS
    const userProfile = await user_profiles.findOne({
      where: { userId },
    });
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found!" });
    }

    const { bio, yearsExp, payoutAccount , github_url} = req.body;

    // HANDLE PROFILE IMAGE UPDATE
    let profileUrl = userProfile.profileUrl;
    let profilePublicId = userProfile.profilePublicId;

    if (req.file) {
      // DELETE OLD IMAGE FROM CLOUDINARY FIRST
      if (userProfile.profilePublicId) {
        await cloudinary.uploader.destroy(userProfile.profilePublicId);
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
    await userProfile.update({
      bio,
      yearsExp,
      payoutAccount,
      profileUrl,
      profilePublicId,
      github_url
    });

    res.json({
      message: "User profile updated successfully!",
      userProfile,
    });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

// GET User PROFILE
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const userProfile = await user_profiles.findOne({
      where: { userId },
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["id", "userName", "email", "gender", "is_verified"],
        },
      ],
    });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found!" });
    }

    res.json({
      message: "User profile retrieved successfully!",
      userProfile,
    });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

const getUserProfileById = async (req, res) => {
  try {
    const { userId } = req.params;

    const userProfile = await user_profiles.findOne({
      where: { userId },
    });

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found!" });
    }

    res.json({
      message: "User profile retrieved successfully!",
      userProfile,
    });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

module.exports = {
  createProfile: createUserProfile,
  updateUserProfile,
  getUserProfile,
  getUserProfileById,
};

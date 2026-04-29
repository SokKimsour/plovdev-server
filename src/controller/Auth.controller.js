const { Users, OtpCode, refreshTokens } = require("../models");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const { generateUsername, generateOtp } = require("../utils/generateForUser");
const sendEmail = require("../utils/sendEmail");
const { Op } = require("sequelize");

// REGISTER
const register = async (req, res) => {
  try {
    const { fullName, email, password, gender } = req.body;

    if (!fullName || !email || !password || !gender) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // VALIDATE EMAIL
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // VALIDATE PASSWORD
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minUppercase: 0,
        minLowercase: 0,
        minNumbers: 0,
        minSymbols: 0,
      })
    ) {
      return res.status(400).json({
        message:
          "Weak password: at least 8 length, at least 1 uppercase and at least 1 lowercase",
      });
    }

    // CHECK EMAIL EXISTS
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // GENERATE OTP FIRST
    const otpCode = generateOtp();

    // SEND EMAIL FIRST — before saving anything to database
    await sendEmail(
      email,
      "PlovDev - Verify Your Email",
      `
        <h2>Welcome to PlovDev!</h2>
        <p>Your verification code is:</p>
        <h1 style="color: #000000">${otpCode}</h1>
        <p>This code expires in 10 minutes.</p>
      `,
    );

    // EMAIL SENT SUCCESSFULLY — now save to database
    const hashPassword = await bcrypt.hash(password, 10);
    const userName = await generateUsername(fullName);

    const user = await Users.create({
      fullName,
      userName,
      email,
      password: hashPassword,
      gender,
      role: "student",
    });

    await OtpCode.create({
      code: otpCode,
      userId: user.id,
      expireAt: new Date(Date.now() + 10 * 60 * 1000),
      is_used: false,
    });

    res.json({
      message:
        "Registration successful. Please check your email for OTP verification.",
      userId: user.id,
    });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // COMPARE PASSWORD
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // CHECK PASSWORD
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // CHECK IF USER VERIFIED EMAIL
    if (!user.is_verified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    );

    // GENERATE REFRESH TOKEN
    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      },
    );

    const refreshTokenTable = await refreshTokens.create({
      token: refreshToken,
      expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      userId: user.id,
    });

    res.json({
      message: "Login successful",
      token: token,
      refreshToken: refreshTokenTable,
    });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

// LOGOUT
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required!" });
    }

    const token = await refreshTokens.findOne({
      where: {
        token: refreshToken,
        is_revoked: false,
        expireAt: { [Op.gt]: new Date() },
      },
    });

    if (!token) {
      return res
        .status(404)
        .json({ message: "Token not found or already revoked!" });
    }

    await refreshTokens.update(
      { is_revoked: true },
      { where: { token: refreshToken } },
    );

    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email is required!' })
    }

    // CHECK IF USER EXISTS
    const user = await Users.findOne({ where: { email } })
    if (!user) {
      return res.status(404).json({ message: 'Email not found!' })
    }

    // GENERATE OTP
    const otpCode = generateOtp()

    // SEND EMAIL FIRST
    await sendEmail(
      email,
      'PlovDev - Reset Your Password',
      `
        <h2>Reset Your Password</h2>
        <p>Your password reset code is:</p>
        <h1 style="color: #000000">${otpCode}</h1>
        <p>This code expires in 10 minutes.</p>
      `
    )

    // DELETE OLD OTP
    await OtpCode.destroy({ where: { userId: user.id } })

    // SAVE NEW OTP
    await OtpCode.create({
      code: otpCode,
      userId: user.id,
      expireAt: new Date(Date.now() + 10 * 60 * 1000),
      is_used: false
    })

    res.json({
      message: 'Password reset code sent to your email!',
      userId: user.id
    })

  } catch (error) {
    res.status(500).json({ messageError: error.message })
  }
}

const verifyForgotOtp = async (req, res) => {
  try {
    const { userId, code } = req.body

    if (!userId || !code) {
      return res.status(400).json({ message: 'Please provide userId and code!' })
    }

    // FIND OTP
    const otp = await OtpCode.findOne({
      where: { userId, code, is_used: false }
    })

    if (!otp) {
      return res.status(400).json({ message: 'Invalid OTP code!' })
    }

    // CHECK IF EXPIRED
    if (new Date() > otp.expireAt) {
      return res.status(400).json({ message: 'OTP code has expired!' })
    }

    // MARK OTP AS USED
    await otp.update({ is_used: true })

    res.json({
      message: 'OTP verified successfully. You can now reset your password.',
      userId
    })

  } catch (error) {
    res.status(500).json({ messageError: error.message })
  }
}

// RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body

    if (!userId || !newPassword) {
      return res.status(400).json({ message: 'Please provide userId and new password!' })
    }

    // VALIDATE NEW PASSWORD
    if (!validator.isStrongPassword(newPassword, {
      minLength: 8,
      minUppercase: 0,
      minLowercase: 0,
      minNumbers: 0,
      minSymbols: 0
    })) {
      return res.status(400).json({ message: 'Weak password: at least 8 characters!' })
    }

    // CHECK IF USER EXISTS
    const user = await Users.findOne({ where: { id: userId } })
    if (!user) {
      return res.status(404).json({ message: 'User not found!' })
    }

    // HASH NEW PASSWORD
    const hashPassword = await bcrypt.hash(newPassword, 10)

    // UPDATE PASSWORD
    await Users.update(
      { password: hashPassword },
      { where: { id: userId } }
    )

    // REVOKE ALL REFRESH TOKENS - force user to login again
    await refreshTokens.update(
      { is_revoked: true },
      { where: { userId } }
    )

    res.json({ message: 'Password reset successfully. Please login again.' })

  } catch (error) {
    res.status(500).json({ messageError: error.message })
  }
}

// REFRESH TOKEN
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required!" });
    }

    const token = await refreshTokens.findOne({
      where: {
        token: refreshToken,
        is_revoked: false,
        expireAt: { [Op.gt]: new Date() },
      },
    });

    if (!token) {
      return res
        .status(404)
        .json({ message: "Token not found or already revoked!" });
    }

    // VERIFY REFRESH TOKEN
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid refresh token!" });
      }

      const newAccessToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN },
      );

      res.json({
        accessToken: newAccessToken,
      });
    });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

// GET ME
const getMe = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: { id: req.user.id },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ messageError: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  forgotPassword,
  verifyForgotOtp,
  resetPassword,
};

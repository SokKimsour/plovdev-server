const { Users , OtpCode } = require("../models");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const { generateUsername, generateOtp } = require("../utils/generateForUser");
const sendEmail = require("../utils/sendEmail");

const register = async (req, res) => {
  try {
    const { fullName, email, password, gender } = req.body

    if (!fullName || !email || !password || !gender) {
      return res.status(400).json({ message: 'Please provide all required fields' })
    }

    // VALIDATE EMAIL
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    // VALIDATE PASSWORD
    if (!validator.isStrongPassword(password, {
      minLength: 8,
      minUppercase: 0,
      minLowercase: 0,
      minNumbers: 0,
      minSymbols: 0,
    })) {
      return res.status(400).json({
        message: 'Weak password: at least 8 length, at least 1 uppercase and at least 1 lowercase'
      })
    }

    // CHECK EMAIL EXISTS
    const existingUser = await Users.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' })
    }

    // GENERATE OTP FIRST
    const otpCode = generateOtp()

    // SEND EMAIL FIRST — before saving anything to database
    await sendEmail(
      email,
      'PlovDev - Verify Your Email',
      `
        <h2>Welcome to PlovDev!</h2>
        <p>Your verification code is:</p>
        <h1 style="color: #000000">${otpCode}</h1>
        <p>This code expires in 10 minutes.</p>
      `
    )

    // EMAIL SENT SUCCESSFULLY — now save to database
    const hashPassword = await bcrypt.hash(password, 10)
    const userName = await generateUsername(fullName)

    const user = await Users.create({
      fullName,
      userName,
      email,
      password: hashPassword,
      gender,
      role: 'student'
    })

    await OtpCode.create({
      code: otpCode,
      userId: user.id,
      expireAt: new Date(Date.now() + 10 * 60 * 1000),
      is_used: false
    })

    res.json({
      message: 'Registration successful. Please check your email for OTP verification.',
      userId: user.id
    })

  } catch (error) {
    res.status(500).json({ messageError: error.message })
  }
}

module.exports = {
  register,
};

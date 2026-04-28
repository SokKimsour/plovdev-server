const { Users, OtpCode } = require("../models");

const verifyOtp = async (req, res) => {
  try {
    const { userId, code } = req.body

    // find OTP in database
    const otp = await OtpCode.findOne({
      where: {
        userId,
        code,
        is_used: false
      }
    })

    if (!otp) {
      return res.status(400).json({ message: 'Invalid OTP code' })
    }

    // check if OTP is expired
    let currentDate = new Date()
    if (currentDate > otp.expireAt) {
      return res.status(400).json({ message: 'OTP code has expired' })
    }

    // mark OTP as used
    await otp.update({ is_used: true })

    // mark user as verified
    await Users.update(
      { is_verified: true },
      { where: { id: userId } }
    )

    res.json({ message: 'Email verified successfully' })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const resendOtp = async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ message: 'Please provide userId' })
    }

    // CHECK IF USER EXISTS
    const user = await Users.findOne({ where: { id: userId } })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // CHECK IF USER IS ALREADY VERIFIED
    if (user.is_verified) {
      return res.status(400).json({ message: 'User is already verified' })
    }

    // DELETE OLD OTP
    await OtpCode.destroy({ where: { userId } })

    // GENERATE NEW OTP
    const otpCode = generateOtp()

    // SEND EMAIL FIRST
    await sendEmail(
      user.email,
      'PlovDev - Verify Your Email',
      `
        <h2>Welcome to PlovDev!</h2>
        <p>Your new verification code is:</p>
        <h1 style="color: #000000">${otpCode}</h1>
        <p>This code expires in 10 minutes.</p>
      `
    )

    // SAVE NEW OTP TO DATABASE
    await OtpCode.create({
      code: otpCode,
      userId: user.id,
      expireAt: new Date(Date.now() + 10 * 60 * 1000),
      is_used: false
    })

    res.json({ message: 'OTP resent successfully. Please check your email.' })

  } catch (error) {
    res.status(500).json({ messageError: error.message })
  }
}


module.exports = {
  verifyOtp,
  resendOtp
}

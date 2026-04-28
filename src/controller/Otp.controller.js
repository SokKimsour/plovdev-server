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

module.exports = {
  verifyOtp,
}

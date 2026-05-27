const  jwt  = require("jsonwebtoken");
const { Users, OtpCode , refreshTokens } = require("../models");
const { generateOtp } = require("../utils/generateForUser");
const sendEmail = require("../utils/sendEmail");
const { getVerificationEmail } = require("../utils/emailTemplates");

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

    const user = await Users.findByPk(userId ) ;

    if (!user) {
      return res.status(404).json({
        message : "User not found!"
      })
    }

    // generate access token
    const accessToken = jwt.sign(
      { id  : user.id ,  role  : user.role , } 
      , process.env.JWT_SECRET , 
      { expiresIn : process.env.JWT_EXPIRES_IN})

      // generate refresh token
    const refreshToken = jwt.sign(
      { id  : user.id ,  role  : user.role , } ,
       process.env.JWT_REFRESH_SECRET , 
      {expiresIn : process.env.JWT_REFRESH_EXPIRES_IN})

      await refreshTokens.create({
        token : refreshToken , 
        expireAt :   new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userId : user.id
       })

      // mark OTP as used
      await otp.update({ is_used: true })
      // mark user as verified
      await user.update(
        { is_verified: true },
      )

      res.cookie("refreshToken" , refreshToken , {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })

    res.json({ message: 'Email verified successfully and login successfully!' , 
      accessToken : accessToken
     })

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
      getVerificationEmail(user.fullName, otpCode)
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

const viewOtpTable = async (req, res) => {
  try {
     const {userId } = req.body ;

     const userWithOtp  = await OtpCode.findOne({where : {userId  : userId } , include : [{
      model : Users , as : "user" , attributes : ["fullName" , "email"]
     }] } )

     if (!userWithOtp) {
      return res.status(404).json({
        message : "User not found!"
      })
     }

     res.json({
      message : "User with Otp code:" , 
      user : userWithOtp
     })
  } catch (error) {
    res.status(500).json({
      messageError : error.message
    })
  }
}

module.exports = {
  verifyOtp,
  resendOtp,
  viewOtpTable
}

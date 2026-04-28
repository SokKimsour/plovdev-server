const rateLimit = require("express-rate-limit");

 const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 10, // max 10 attempts
  message: {
    message: "Too many login attempts, please try again after 15 minutes"
  }
});

module.exports = {
  loginLimiter
};
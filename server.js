require('dotenv').config();

const express = require('express')
const morgan = require('morgan');
const passport = require("passport") ;
const { Op } = require('sequelize');
const { refreshTokens } = require('./src/models');
const cron = require('node-cron');
const cors =  require("cors")
const cookieParser = require("cookie-parser")
require("./src/config/passport")

const app = express()
app.use(express.json())
app.use(morgan('dev'));
app.use(passport.initialize())
app.use(cookieParser()); 
const port = process.env.PORT || 3000

app.use(cors({
  origin: [process.env.FRONTEND_URL , process.env.NGROK_URL] ,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  exposedHeaders: ['Authorization']
}));

app.set("trust proxy" , 1)

// Swagger api docs
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

const authRoutes = require('./src/routes/Auth.route');
app.use('/api/v1', authRoutes);

const otpRoutes = require('./src/routes/Otp.route');
app.use('/api/v1', otpRoutes);

const adminRoutes = require('./src/routes/Admin.route');
app.use('/api/v1/admin', adminRoutes);

const telegramRoutes = require('./src/routes/Telegram.route');
app.use('/telegram', telegramRoutes);

const teacherRoutes = require('./src/routes/UserProfile.route');
app.use('/api/v1', teacherRoutes);

const courseRoutes = require('./src/routes/Courses.route');
app.use('/api/v1', courseRoutes);

const sectionRoutes = require('./src/routes/Section.route');
app.use('/api/v1', sectionRoutes);

const lessonRoutes = require('./src/routes/Lesson.route');
app.use('/api/v1', lessonRoutes);

const categoryRoutes = require('./src/routes/Categories.route');
app.use('/api/v1', categoryRoutes);

const quizRoutes = require('./src/routes/Quiz.routes');
app.use('/api/v1', quizRoutes);

const courseProgressRoutes = require('./src/routes/CourseProgress.routes');
app.use('/api/v1', courseProgressRoutes);

const paymentRoutes = require('./src/routes/Payment.routes');
app.use('/api/v1', paymentRoutes);

const adminNotificationRoutes = require('./src/routes/AdminNotification.routes');
app.use('/api/v1/admin/notifications', adminNotificationRoutes);

const enrollmentRoutes = require('./src/routes/Enrollment.routes');
app.use('/api/v1/enrollments', enrollmentRoutes);

const certificateRoutes = require('./src/routes/Certificate.route');
app.use('/api/v1', certificateRoutes);


// TESTING THE BACKEND HEALTH
app.get("/health" , (req , res) => {
  try {
      res.json({
        message : "Backend is good!"
      })
  } catch (error) {
    res.status(500).json({
      message : error.message
    })
  }
})

app.get("/" , (req , res) => {
  try {
      res.json({
        message : "Welcome to PlovDev Backend!"
      })
  } catch (error) {
    res.status(500).json({
      message : error.message
    })
  }
})

// CLEAUP EXPIRED TOKENS EVERY AT MIDNIGHT
// THIS ONE IS IS USE FOR TO DELETE THE TOKEN THAT HAS BEEN EXPIRED
cron.schedule('0 0 * * *', async () => {
  try {
    const deleted = await refreshTokens.destroy({
      where: {
        [Op.or]: [
          { expireAt: { [Op.lt]: new Date() } }, // expired
          { is_revoked: true }                    // revoked but not expired yet
        ]
      }
    });
    console.log(`Cleaned up ${deleted} tokens`);
  } catch (error) {
    console.error('Cleanup failed:', error.message);
  }
});


//  GLOBAL ERROR HANDLING MIDDLEWARE 
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Handle Sequelize validation or unique constraint errors cleanly
  if (err.name === 'SequelizeUniqueConstraintError' || err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      status: 'fail',
      message: err.errors?.[0]?.message || "Database validation failed"
    });
  }

  res.status(statusCode).json({
    status: statusCode >= 400 && statusCode < 500 ? "fail" : "error",
    message: message,
    // Stack trace shows only in development mode to save your terminal space
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

app.listen(port, () => {
  console.log(`Running on port: ${port}`)
})

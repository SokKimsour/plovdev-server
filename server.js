require('dotenv').config();

const express = require('express')
const morgan = require('morgan');
const passport = require("passport") ;
require("./src/config/passport")

const app = express()
app.use(express.json())
app.use(morgan('dev'));
app.use(passport.initialize())
const port = 3000

// Swagger api docs
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

const authRoutes = require('./src/routes/Auth.route');
app.use('/api/v1', authRoutes);

const otpRoutes = require('./src/routes/Otp.route');
app.use('/api/v1', otpRoutes);

const teacherRoutes = require('./src/routes/UserProfile.route');
app.use('/api/v1', teacherRoutes);

const courseRoutes = require('./src/routes/Courses.route');
app.use('/api/v1', courseRoutes);

const sectionRoutes = require('./src/routes/Section.route');
app.use('/api/v1', sectionRoutes);

const lessonRoutes = require('./src/routes/Lesson.route');
app.use('/api/v1', lessonRoutes);



app.listen(port, () => {
  console.log(`Running on port: ${port}`)
})

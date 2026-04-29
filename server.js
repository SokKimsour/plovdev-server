require('dotenv').config();

const express = require('express')
const app = express()
app.use(express.json())

const port = 3000



const authRoutes = require('./src/routes/Auth.route');
app.use('/api/v1', authRoutes);

const otpRoutes = require('./src/routes/Otp.route');
app.use('/api/v1', otpRoutes);

const teacherRoutes = require('./src/routes/TeacherProfile.route');
app.use('/api/v1', teacherRoutes);

const studentRoutes = require('./src/routes/StudentProfile.route');
app.use('/api/v1', studentRoutes);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

require('dotenv').config();

const express = require('express')
const app = express()
app.use(express.json())

const port = 3000



const authRoutes = require('./src/routes/Auth.route');
app.use('/api/v1', authRoutes);

const otpRoutes = require('./src/routes/Otp.route');
app.use('/api/v1', otpRoutes);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

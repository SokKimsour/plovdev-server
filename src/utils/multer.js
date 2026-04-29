const multer = require('multer')

const storage = multer.memoryStorage()  // store file in memory as buffer

const upload = multer({ storage })

module.exports = upload
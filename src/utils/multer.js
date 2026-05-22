const multer = require('multer')

const storage = multer.memoryStorage()  // store file in memory as buffer

// UPLOAD IMAGE TO PROFILE
const uploadToProfile = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024  // 5MB 
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files allowed!'), false)
    }
  }
})

// UPLOAD IMAGE TO THUMBNAIL
const uploadToThumbnail = multer({  
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024  // 5MB 
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files allowed!'), false)
    }
  }
})

// UPLOAD VIDEO
const uploadToVideo = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024  // 500MB 
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true)
    } else {
      cb(new Error('Only video files allowed!'), false)
    }
  }
})

module.exports = {
  uploadToProfile,
  uploadToThumbnail,  
  uploadToVideo,
}
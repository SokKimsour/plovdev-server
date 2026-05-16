const multer = require('multer')

const storage = multer.memoryStorage()  // store file in memory as buffer

// UPLOAD IMAGE TO PROFILE
const uploadToProfile = multer({
    storage : storage ,
    limits : {
        files : 5 * 1024 * 1024 
    }
})

// UPLOAD IMAGE TO THUMBNAIL
const uploadToThumnail = multer({
    storage : storage ,
    limits : {
        files : 25 * 1024 * 1024 
    }
})

// UPLOAD VIDEO 
const uploadToVideo = multer({
    storage : storage ,
    limits : {
        files : 25 * 1024 * 1024 
    }
})


module.exports  = {
    uploadToProfile , 
    uploadToThumnail,
    uploadToVideo,
}
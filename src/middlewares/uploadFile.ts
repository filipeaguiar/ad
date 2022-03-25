import util from 'util'
import multer from 'multer'
import dotenv from 'dotenv'

dotenv.config()
const maxSize = 2 * 1024 * 1024
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.UPLOAD_PATH)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

let uploadFile = multer({
    storage: storage,
    limits: {fileSize: maxSize}
}).single("file")

// let uploadFile = multer({
//     dest: process.env.UPLOAD_PATH
// }).single('file')

let UploadFileMiddleware = util.promisify(uploadFile)

export default  UploadFileMiddleware
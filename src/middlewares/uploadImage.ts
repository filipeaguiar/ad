import util from 'util'
import multer from 'multer'
import dotenv from 'dotenv'

dotenv.config()
const maxSize = 20 * 1024 * 1024
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {   
            cb(null, process.env.UPLOAD_PATH + '/img/' )
        }
        catch (err) {
            console.log(err)
        }
    },
    filename: (req, file, cb) => {
        try { cb(null, file.originalname) }
        catch (err) {
            console.log(err)
        }
    }
})

let uploadImage = multer({
    storage: storage,
    limits: { fileSize: maxSize }
}).single("file")

let UploadImageMiddleware = util.promisify(uploadImage)

export default UploadImageMiddleware

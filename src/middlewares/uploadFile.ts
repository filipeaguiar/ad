import util from 'util'
import multer from 'multer'

const maxSize = 20 * 1024 * 1024
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(req.app.locals.__basedir)
        if (file.originalname.substring(file.originalname.length - 3, file.originalname.length)) {
            cb(null, req.app.locals.__basedir + '/sigtap')
        }
        cb(null, req.app.locals.__basedir + '/bpa')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize }
}).single("file")

let UploadFileMiddleware = util.promisify(uploadFile)

export default UploadFileMiddleware
import util from 'util'
import multer from 'multer'

const maxSize = 30 * 1024 * 1024
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            if (file.originalname.substring(file.originalname.length - 3, file.originalname.length) === 'txt') {
                cb(null, req.app.locals.__basedir + '/sigtap')
            }
            if (file.originalname.substring(file.originalname.length - 3, file.originalname.length) === 'csv') {
                cb(null, `${req.app.locals.__basedir}/${req.query.path}`)
            }
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

let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize }
}).single("file")

let UploadFileMiddleware = util.promisify(uploadFile)

export default UploadFileMiddleware

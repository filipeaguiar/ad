import uploadFile from "../middlewares/uploadFile"
import * as fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()
export default class uploadController {
    /**
     * 
     * @param req Objeto Request do ExpressJS
     * @param res Objeto Response do ExpressJS
     */
    static async upload(req, res) {
        try {
            await uploadFile(req, res)
            if (req.file == undefined) {
                return res.status(400).send({ message: "Please upload a file!" })
            }
            res.status(200).send({
                message: "Uploaded the file successfully: " + req.file.originalname,
            })
        } catch (err) {
            console.dir(req)
            res.status(500).send({
                message: `Could not upload the file: ${req.file.originalname}. ${err}`,
            })
        }
    }

    static getListFiles(req, res) {
        const directoryPath = process.env.UPLOAD_PATH
        fs.readdir(directoryPath, function (err, files) {
            if (err) {
                res.status(500).send({
                    message: "Unable to scan files!",
                })
            }
            let fileInfos = []
            files.forEach((file) => {
                fileInfos.push({
                    name: file,
                    url: 'http://localhost:3333/' + file,
                })
            })
            res.status(200).send(fileInfos)
        })
    }
    static download(req, res) {
        const fileName = req.params.name
        const directoryPath = process.env.UPLOAD_PATH
        res.download(directoryPath + fileName, fileName, (err) => {
            if (err) {
                res.status(500).send({
                    message: "Could not download the file. " + err,
                })
            }
        })
    }
}
import uploadFile from "../middlewares/uploadFile"
import * as fs from 'fs'
import dotenv from 'dotenv'
import path from 'path'

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
                console.log({ message: "Please upload a file!" })
                return res.status(400).send({ message: "Please upload a file!" })
            }
            console.log({
                message: "Uploaded the file successfully: " + req.file.originalname,
            })
            res.status(200).send({
                message: "Uploaded the file successfully: " + req.file.originalname,
            })
        } catch (err) {
            console.log({
                message: `Could not upload the file: ${req.file.originalname}. ${err}`,
            })
            res.status(500).send({
                message: `Could not upload the file: ${req.file.originalname}. ${err}`,
            })
        }
    }

    static getListFiles(req, res) {
        const directoryPath = process.env.UPLOAD_PATH
        fs.readdir(directoryPath, function (err, files) {
            if (err) {
                res.status(200).send({

                })
            }
            let fileInfos = []
            files.forEach((file) => {
                fileInfos.push({
                    name: file,
                    url: process.env.HOST + "bpa/" + file,
                })
            })
            res.status(200).send(fileInfos)
        })
    }

    static getBPAList(req, res) {
        const directoryPath = process.env.UPLOAD_PATH
        fs.readdir(directoryPath, function (err, files) {
            if (err) {
                res.status(500).send({
                    message: "Unable to scan files!",
                })
            }
            let fileInfos = []
            files.forEach((file) => {
                if (path.extname(file) == '.csv') {
                    fileInfos.push({
                        file,
                    })
                }
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
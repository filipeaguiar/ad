import uploadFile from "../middlewares/uploadFile"
import uploadImage from "../middlewares/uploadImage"
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

    /**
     * 
     * @param req Objesto Request do ExpressJS
     * @param res Objeto Response do ExpressJS
     * @description Método para fazer upload de imagens do Painel de Dados BI
     */
    static async uploadImg(req, res) {
        try {
            await uploadImage(req, res)
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

    /** 
     * @param req Objeto Request do ExpressJS
     * @param res Objeto Response do ExpressJS
     * @description Método para listar os arquivos do diretório bpa
     * @returns Lista de arquivos do diretório bpa
     * 
    */
    static getListFiles(req, res) {
        const directoryPath = req.app.locals.__basedir + '/bpa'
        fs.readdir(directoryPath, function (err, files) {
            let fileInfos = []
            if (err) {
                res.status(200).send(fileInfos)
            }
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
        const directoryPath = `${req.app.locals.__basedir}/${req.query.path}`
        try {
            fs.readdir(directoryPath, function (err, files) {
                let fileInfos = []
                if (files) {
                    files.forEach((file) => {
                        if (path.extname(file) == '.csv') {
                            fileInfos.push({
                                file,
                            })
                        }
                    })
                }
                res.status(200).send(fileInfos)
            })
        } catch (err) {
            res.status(200).send([])
        }
    }

    static download(req, res) {
        const fileName = req.params.name
        const directoryPath = req.app.locals.__basedir + '/bpa'
        res.download(directoryPath + fileName, fileName, (err) => {
            if (err) {
                res.status(500).send({
                    message: "Could not download the file. " + err,
                })
            }
        })
    }

    static delete(req, res) {
        const fileName = req.query.fileName
        const directoryPath = `${req.app.locals.__basedir}/${req.query.path}`
        fs.unlink(`${directoryPath}/${fileName}`, (err) => {
            if (err) {
                res.status(500).send({
                    message: "Could not delete the file. " + err,
                })
            }
            res.status(200).send({
                message: "File deleted successfully",
            })
        })
    }
}
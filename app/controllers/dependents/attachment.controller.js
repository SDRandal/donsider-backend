const { IMAGEURL, FILEURL, getUTCTimestamp, createSignature, createPolicy, createSignedUrl, generateSignedUrl } = require("../../config/files.config")
const db = require("../../models")
const helpers = require("../helpers/plan.helper")
const Plan = db.plan
const Attachment = db.attachment
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const { s3Client } = require("../../config/s3Client")
const fs = require('fs')
const { createWriteStream } = require('fs')
const path = require("path")
const { attachment } = require("../../models")

// TODOI will need to make sure this gets called in both the update and removal methods
const removeFileFromFS = (filepath) => {
    fs.unlink('./' + filepath, (err)=>{
        if(err){
            console.log("File removal error: \n" + err)

        }
    })
}

const removeFileFromS3 = (filename) =>{

    const s3Params = {
        Bucket:"donsider-attachments-v1",
        Key: "images/" + filename

    }

    s3Client.send(new DeleteObjectCommand(s3Params))
    .then((data)=>{
        console.log(data)
    })
    .catch((err)=>{
        console.log("There was an error removing file from s3: \n", err)
    })

}
exports.addAttachment = (req, res) => {
    Plan.findById(req.params.pid, (err, plan) => {
        if (err) {
            return res.status(500).send({ message: "There was an issue locating the requested plan", err })
        }
        if (!plan) {
            return res.status(404).send({ message: "The requested plan does not exist" })
        }
        // TODO This is where I need to persist the data from the upload, and create a preview if the data is an image...
        if (req.file) {

            // TODO I should probably sanitize the filename before saving this file. My fear is someone entering a filename that crashes s3

            const fileName = req.file.filename

            // BEGIN BUCKET IMPL
            const s3BucketParams = {
                Bucket: "donsider-attachments-v1",
                Key: "images/" + fileName,
                Body: fs.createReadStream(req.file.path)
            }

            // TODO Eventually I will need to create a couple different "preview" images for each file and upload those
            s3Client.send(new PutObjectCommand(s3BucketParams))
                .then((data) => {
                    // remove file from temp storage

                    const newUrl = generateSignedUrl("images/" + fileName)

                    const newAttachment = new Attachment({
                        persistentFileName: fileName,
                        displayName: req.file.originalname,
                        fileType: path.extname(req.file.originalname),
                        temp: newUrl,
                    })
        
                    plan.attachments = [...plan.attachments, newAttachment]
                    plan.save()
                    res.send({ newProperty: plan.attachments, planId: req.params.pid, propertyType: "attachments", message: "Attachment successfully added" })
                    removeFileFromFS(req.file.path)
                        })
                .catch((err) => {
                    console.log("Upload Error: \n", err)
                    res.status(500).send({ message: "There was an issue proceeing your upload. Error: ", err })
                })
            //  END BUCKET IMPL



        }
    })
}
exports.updateAttachment = (req, res) => {
    const planId = req.params.pid
    const attachmentId = req.params.aid

    Plan.findById(planId, (err, plan) => {
        if (err) {
            return res.status(500).send({ message: "There was an issue locating the requested plan", err })
        }
        if (!plan) {
            return res.status(404).send({ message: "The requested plan does not exist" })
        }
        const targetAttachment = plan.attacments.find((attachment) => attachment._id == attachmentId)
        if (!targetAttachment) {
            return res.status(404).send({ message: "The requested attachment does not exist" })
        } else {
            for (key in req.body) {
                if (key === "_id") {
                    return res.status(403).send({ message: "Cannot update object id" })
                }
                if (targetAttachment[key]) {
                    targetAttachment[key] = req.body[key]
                }
            }
            plan.attachments = helpers.replaceItem(plan.attachments, attachmentId, targetAttachment)
            plan.save()
            res.send({ newProperty: plan.attachments, planId: req.params.pid, propertyType: "attachments", message: "Attachment successfully updated" })
            removeFileFromFS()
        }
    })
}
exports.deleteAttachmentFromS3 = (attachmentName) => {
    // TODO This is a terrible name for this function, but I don't want to make the local function that actually removes the file from S3 to be under exports, then I'm not sure how to use it in other functions within this same file
    removeFileFromS3(attachmentName)
}
exports.removeAttachment = (req, res) => {
    const planId = req.params.pid
    const attachmentId = req.params.aid

    Plan.findById(planId, (err, plan) => {
        if (err) {
            return res.status(500).send({ message: "There was an issue locating the requested plan", err })
        }
        if (!plan) {
            return res.status(404).send({ message: "The requested plan does not exist" })
        }
        const targetAttachment = plan.attachments.find((attachment) => attachment._id == attachmentId)
        if (!targetAttachment) {
            return res.status(404).send({ message: "The requested attachment does not exist" })
        } else {
            plan.attachments = plan.attachments.filter((attachment) => attachment._id != attachmentId)
            plan.save()
            res.send({ message: "Attachment successfully deleted", newProperty: plan.attachments, planId: req.params.pid, propertyType: "attachments" })
            removeFileFromS3(targetAttachment.persistentFileName)

        }
    })
}
exports.requestLink = (req, res) => {
    Plan.findById(req.params.pid, (err, plan) => {
        if (err) {
            return res.status(500).send({ message: "There was an issue locating the requested plan", err })
        }
        if (!plan) {
            return res.status(404).send({ message: "The requested plan does not exist" })
        }
        const attachment = plan.attachments.find((plan) => plan._id == req.params.aid)
        if (!attachment) {
            return res.status(404).send({ message: "The requested attachment does not exist" })
        }
        const link = generateSignedUrl("images/" + attachment.persistentFileName)
        res.send({ link })
    })
}
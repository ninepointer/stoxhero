const mongoose = require('mongoose');
const Blog = require('../../models/blogs/blogs');
const { stringify } = require('flatted');
const moment = require('moment');
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
// const Blog = require('../../models/blogs/blogs');


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
    // accessKeyId: "AKIASR77BQMICZATCLPV",
    // secretAccessKey: "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",

});
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


exports.getUploads = (async (req, res, next) => {

    try {
        const { title } = req.body;
        console.log(req.body)
        const uploadedFiles = req.files;
        // const newFile = req.titleFiles
        console.log("uploadedFiles", uploadedFiles.files, uploadedFiles.titleFiles)

        const otherImages = await Promise.all(await processUpload(uploadedFiles.files, s3, title));
        const titleImage = await Promise.all(await processUpload(uploadedFiles.titleFiles, s3, title));
        // const data = await UploadedSchema.create({
        //     name: name,
        //     discription: description,
        //     price: price,
        //     currency: currency,
        //     link: uploadedData[0].url,
        // });

        console.log("otherImages", otherImages);
        console.log("titleImage", titleImage);

        const blog = await Blog.create({
            blogTitle: title, thumbnailImage: titleImage[0], images: otherImages,
            createdBy: req.user._id, lastModifiedBy: req.user._id
        });
        console.log(blog)
        res.status(200).json(blog);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error uploading files.");
    }

});

const processUpload = async(uploadedFiles, s3, title)=>{
    const fileUploadPromises = uploadedFiles.map(async (file) => {
        const key = `blogs/${title}/photos/${(Date.now()) + file.originalname}`;
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
        };
        const uploadedObject = await s3.upload(uploadParams).promise();
        return {
            name: file.originalname,
            url: uploadedObject.Location,
            // size: (uploadedObject).Size,
            // mimetype: file.mimetype,
        };
    });

    return fileUploadPromises;
}
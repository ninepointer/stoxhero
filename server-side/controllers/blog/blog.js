const mongoose = require('mongoose');
const Blog = require('../../models/blogs/blogs');
const{stringify} = require('flatted');
const moment = require('moment');
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const storage = multer.memoryStorage();


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION

});
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


exports.createBlog = (async (req, res, next) => {

    try {
        const { title } = req.body;
        const uploadedFiles = req.files;
        const otherImages = await Promise.all(await processUpload(uploadedFiles.files, s3, title));
        const titleImage = await Promise.all(await processUpload(uploadedFiles.titleFiles, s3, title));


        const blog = await Blog.create({
            blogTitle: title, thumbnailImage: titleImage[0], images: otherImages,
            createdBy: req.user._id, lastModifiedBy: req.user._id
        });
        console.log(blog)
        res.status(200).json({status: "success", data: blog});
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
            ContentType: file.mimetype,
            ACL: 'public-read',
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
 


// exports.createBlog = async (req, res) => {
    
//     try {
//         const {blogTitle, content, author, tags} = req.body;
//         const thumbnailImage = (req).uploadUrl;
//         console.log(req.body)
//         console.log(thumbnailImage)
//         if(!blogTitle)return res.status(400).json({status: 'error', message: 'Enter all mandatory fields.'})
//         const blog = await Blog.create({
//             blogTitle, content, author, tags,
//             createdBy: req.user._id, lastModifiedBy: req.user._id, thumbnailImage
//         });

//         res.status(201).json({
//             status: 'success',
//             message: "Blog created successfully",
//             data: blog
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             status: 'error',
//             message: "Something went wrong",
//             error: error.message
//         });
//     }
// };

exports.saveBlogData = async(req, res, next) => {
    const id = req.params.id;
    console.log("Req Body:",req.body)
    console.log("id is ,", id)
    const blog = await Blog.findOneAndUpdate({_id: new ObjectId(id)}, {
        $set: {
            blogData: req.body.blogData
        }
    });

    // const filteredBody = filterObj(req.body, "blogTitle", "content", "author", "thumbnailImage");
    // if(req.body.blogContent)filteredBody.blogContent=[...blog.blogContent,
    //     {serialNumber:req.body.blogContent.serialNumber,
    //         content:req.body.blogContent.content,header:req.body.blogContent.header,youtubeVideoCode:req.body.blogContent.youtubeVideoCode,image:req.body.blogContent.image}]
    // filteredBody.lastModifiedBy = req.user._id;    

    // console.log(filteredBody)
    // const updated = await Blog.findByIdAndUpdate(id, filteredBody, { new: true });

    return res.status(200).json({message: 'Successfully saved Blog Data.', data: blog});
}

exports.editBlog = async(req, res, next) => {
    const id = req.params.id;
    console.log("Req Body:",req.body)
    console.log("id is ,", id)
    const blog = await Blog.findById(id);

    const filteredBody = filterObj(req.body, "blogTitle", "content", "author", "thumbnailImage");
    if(req.body.blogContent)filteredBody.blogContent=[...blog.blogContent,
        {serialNumber:req.body.blogContent.serialNumber,
            content:req.body.blogContent.content,header:req.body.blogContent.header,youtubeVideoCode:req.body.blogContent.youtubeVideoCode,image:req.body.blogContent.image}]
    filteredBody.lastModifiedBy = req.user._id;    

    console.log(filteredBody)
    const updated = await Blog.findByIdAndUpdate(id, filteredBody, { new: true });

    return res.status(200).json({message: 'Successfully edited Blog.', data: updated});
}

exports.updateBlogStatus = async (req, res) => {
    try {
        const { id, status } = req.params;
        console.log("Update Blog:",id,status)
        const updateFields = req.body;

        let blog = await Blog.findOne({ _id: id },{ new: true }).populate('lastModifiedBy', 'first_name last_name');

        if (!blog) {
            return res.status(404).json({
                status: 'error',
                message: "Blog not found.",
            });
        }
        
        updateFields.lastModifiedBy = req.user._id;
        updateFields.lastModifiedOn = new Date();
        updateFields.status = status;
        blog = await Blog.findOneAndUpdate({  _id: id }, updateFields, { new: true });
        console.log(blog)
        res.status(200).json({
            status: 'success',
            message: `Blog ${status} successfully`,
            data: blog
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('lastModifiedBy', 'first_name last_name')
        .populate('blogContent', 'header, serialNumber, content, image, youtubeVideoCode');
        
        res.status(200).json({
            status: 'success',
            data: blogs
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.getBlog = async (req, res) => {
    const { id } = req.params;
    try {
        const blogs = await Blog.findOne({_id:id}).populate('lastModifiedBy', 'first_name last_name')
        .populate('blogContent', 'header, serialNumber, content, image, youtubeVideoCode');
        
        res.status(200).json({
            status: 'success',
            data: blogs
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.getPublishedBlogs = async (req, res) => {
    try {
        // const publishedBlogs = await Blog.find({ status: 'Published' }).populate('lastModifiedBy', 'first_name last_name')
        // .populate('blogContent', 'header, serialNumber, content, image, youtubeVideoCode')
        
        // res.status(200).json({
        //     status: 'success',
        //     data: publishedBlogs,
        //     count: publishedBlogs.length
        // });

        const publishedBlogs = await Blog.find().populate('lastModifiedBy', 'first_name last_name')
        
        res.status(200).json({
            status: 'success',
            data: publishedBlogs,
            count: publishedBlogs.length
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.getDraftBlogs = async (req, res) => {
    try {
        const draftBlogs = await Blog.find({ status: 'Created' }).populate('lastModifiedBy', 'first_name last_name')
        .populate('blogContent', 'header, serialNumber, content, image, youtubeVideoCode')
        
        res.status(200).json({
            status: 'success',
            data: draftBlogs,
            count: draftBlogs.length
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.getUnpublishedBlogs = async (req, res) => {
    try {
        const unpublishedBlogs = await Blog.find({ status: 'Unpublished' }).populate('lastModifiedBy', 'first_name last_name')
        .populate('blogContent', 'header, serialNumber, content, image, youtubeVideoCode')
        
        res.status(200).json({
            status: 'success',
            data: unpublishedBlogs,
            count: unpublishedBlogs.length
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Something went wrong",
            error: error.message
        });
    }
};
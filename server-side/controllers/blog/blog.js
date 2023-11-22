const mongoose = require('mongoose');
const Blog = require('../../models/blogs/blogs');
const{stringify} = require('flatted');
const moment = require('moment');
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
// console.log("File upload started");
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
} else {
    cb(new Error("Invalid file type"), false);
}
}
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
    // accessKeyId: "AKIASR77BQMICZATCLPV",
    // secretAccessKey: "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",
  
  });
  
const upload = multer({ storage, fileFilter }).single("thumbnailImage");
// console.log("Upload:",upload)
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// console.log("Keys:",process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);

exports.uploadMulter = upload;

exports.resizePhoto = (req, res, next) => {
    if (!req.file) {
      // no file uploaded, skip to next middleware
      console.log('no file');
      next();
      return;
    }
    sharp(req.file.buffer).resize({width: 1080, height: 720}).toBuffer()
    .then((resizedImageBuffer) => {
      req.file.buffer = resizedImageBuffer;
      // console.log("Resized:",resizedImageBuffer)
      next();
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Error resizing photo" });
    });
}; 

exports.uploadToS3 = async (req, res, next) => {
    if (!req.file) {
        // no file uploaded, skip to next middleware
        next();
        return;
    }

    // create S3 upload parameters
    let blogTitle;
    if (req.body.blogTitle) {
        blogTitle = req.body.blogTitle;
    } else {
        let blog = await Blog.findById(req.params.id);
        blogTitle = `${blog?.blogTitle}`;
    }
    const key = `blogs/${blogTitle}/photos/${(Date.now()) + req.file.originalname}`;
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'public-read',
    };

    // upload image to S3 bucket

    s3.upload((params)).promise()
        .then((s3Data) => {
            // console.log('file uploaded');
            // console.log(s3Data.Location);
            (req).uploadUrl = s3Data.Location;
            next();
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ message: "Error uploading to S3" });
        });
};


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (
            allowedFields.includes(el) &&
            obj[el] !== null &&
            obj[el] !== undefined &&
            obj[el] !== ''
        ) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};
 


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

exports.createBlog = async (req, res) => {
    
    try {
        const {blogTitle, content, author, tags, value} = req.body;
        // const thumbnailImage = (req).uploadUrl;
        console.log(req.body)
        // console.log(thumbnailImage)
        // if(!blogTitle)return res.status(400).json({status: 'error', message: 'Enter all mandatory fields.'})
        const blog = await Blog.create({
            value,
            createdBy: req.user._id, lastModifiedBy: req.user._id
        });

        res.status(201).json({
            status: 'success',
            message: "Blog created successfully",
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

// exports.editBlog = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updateFields = req.body;

//         let blog = await Blog.findOne({ _id: id });

//         if (!blog) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: "Blog not found.",
//             });
//         }

//         updateFields.lastModifiedBy = req.user._id;
//         updateFields.lastModifiedOn = new Date();
//         blog = await Blog.findOneAndUpdate({  _id: id }, updateFields, { new: true }).populate('lastModifiedBy', 'first_name last_name');

//         res.status(200).json({
//             status: 'success',
//             message: "Blog updated successfully",
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
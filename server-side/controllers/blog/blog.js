const Blog = require('../../models/blogs/blogs');
const AWS = require('aws-sdk');
const { ObjectId } = require("mongodb");
const {decode} = require('html-entities');
const sharp = require('sharp');


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
        const { title, metaTitle, category, metaDescription, metaKeywords, status  } = req.body;
        const slug = title.replace(/ /g, "-").toLowerCase();
        const uploadedFiles = req.files;
        const otherImages = uploadedFiles.files && await Promise.all(await processUpload(uploadedFiles.files, s3, title));
        const titleImage = uploadedFiles.titleFiles && await Promise.all(await processUpload(uploadedFiles.titleFiles, s3, title, true));
        const blog = await Blog.create({
            blogTitle: title, thumbnailImage: titleImage[0], images: otherImages,
            createdBy: req.user._id, lastModifiedBy: req.user._id, status: "Created",
            metaTitle, category, metaDescription, metaKeywords, slug
        });
       
        res.status(200).json({status: "success", data: blog, message: "Blog created successfully."});
    } catch (error) {
        console.error(error);
        res.status(500).send({status: "error", err: error, message: "Error uploading files."});
    }

});

const processUpload = async(uploadedFiles, s3, title, isTitleImage)=>{
    const MAX_LIMIT = 5*1024*1024;
    const fileUploadPromises = uploadedFiles.map(async (file) => {
        
        if(file.size > MAX_LIMIT){
            return res.status(500).send({status: "error", err: error, message: 'Image size should be less then 5 MB.'});
        }
        if(isTitleImage){
            file.buffer = await sharp(file.buffer)
            .resize({ width: 1080, height: 720 })
            .toBuffer();
        }
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

exports.editBlog = (async (req, res, next) => {

    try {
        // const { title } = req.body;
        const update = req.body;
        const {id} = req.params;
        const uploadedFiles = req.files;
        let otherImages; let titleImage;

        // console.log("uploadedFiles", uploadedFiles);
        const blog = await Blog.findOne({_id: new ObjectId(id)});
        // if(title){
        //     blog.blogTitle = title;
        // }
        if(uploadedFiles?.files){
            otherImages = await Promise.all(await processUpload(uploadedFiles.files, s3, update.blogTitle));
            update.images = blog.images.concat(otherImages);
            // console.log("blog.images", blog.images)
        }
        if(uploadedFiles?.titleFiles){
            titleImage = await Promise.all(await processUpload(uploadedFiles.titleFiles, s3, update.blogTitle, true));
            update.thumbnailImage = titleImage[0];
        }
        if(update.blogTitle){
            update.slug = update.blogTitle.replace(/ /g, "-").toLowerCase();
        }

        update.lastModifiedBy = req?.user?._id;
        update.lastModifiedOn = new Date();
        if(update.status === "Published"){
            update.publishedOn = new Date();
        }
        const blogUpdate = await Blog.findOneAndUpdate({_id: new ObjectId(id)}, update, {new: true})

        // console.log("blog", blogUpdate , update)
        res.status(200).json({status: "success", data: blogUpdate, message: "Blog edited successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).send({status: "error", err: error, message: "Error uploading files."});
    }

});

exports.removeImage = (async (req, res, next) => {

    try {
        const {id, docId} = req.params;

        // console.log(uploadedFiles, update);
        const blog = await Blog.findOne({_id: new ObjectId(id)});
        const images = blog.images.filter((elem)=>{
            return elem._id.toString() !== docId.toString()
        });

        blog.images = images;
        await blog.save({ validateBeforeSave: false, new: true })

        res.status(200).json({status: "success", data: blog, message: "Blog edited successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).send({status: "error", err: error, message: "Error uploading files."});
    }

});

exports.saveBlogData = async(req, res, next) => {
    console.log("saved data")
    const id = req.params.id;
//     const textDecoder = new TextEncoder();

//     const decodedData = textDecoder.decode(req.body.blogData);
// console.log(decodedData)
    const content = decode(req.body.blogData)
    const wordCount = content.split(" ").length;

    // Average reading speed (in words per minute)
    const wordsPerMinute = 200;

    // Calculate the reading time in minutes
    const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
    const blog = await Blog.findOneAndUpdate({_id: new ObjectId(id)}, {
        $set: {
            blogData: decode(req.body.blogData),
            readingTime: readingTimeMinutes
        }
    });

    return res.status(200).json({message: 'Successfully saved Blog Data.', data: blog});
}

exports.getUserPublishedBlogs = async (req, res, next) => {
    try {
        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 10
        const count = await Blog.countDocuments({ status: "Published" });

        const publishedBlogs = await Blog.find({ status: "Published" })
            .select('-reader -images -createdBy -createdOn -lastModifiedOn -lastModifiedBy -metaDescription -metaTitle -metaKeywords -blogData')
            .sort({ publishedOn: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            status: 'success',
            data: publishedBlogs,
            count: count
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: "Something went wrong",
            error: error.message
        });
    }
}

exports.viewBlog = async(req, res, next) => {
    const {ip, isMobile, country, blogId} = req.body;
    const blog = await Blog.findOne({_id: new ObjectId(blogId)});
    let flag = false;

    await Promise.all(blog.reader.map((elem)=>{
        if(elem.ip === ip){
            flag = true
        }
    }))

    if(!flag){
        blog.reader.push({
            ip: ip,
            isMobile: isMobile,
            country: country,
            time: new Date()
        })
    }

    blog.viewCount += 1;
    const save = await blog.save({ validateBeforeSave: false, new: true });


    return res.status(200).json({status:"success", message: 'reader data saved.', data: save});
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

exports.getBlogByTitle = async (req, res) => {
    const { title } = req.params;
    try {
        const blogs = await Blog.findOne({slug: title})
        .select('-reader')
        res.status(201).json({
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
        const blogs = await Blog.findOne({_id:new ObjectId(id)})
        // .populate('lastModifiedBy', 'first_name last_name')
        // .populate('blogContent', 'header, serialNumber, content, image, youtubeVideoCode');
        // .select('-reader')
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

        const publishedBlogs = await Blog.find({status: "Published"}).populate('lastModifiedBy', 'first_name last_name')
        
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
        const clientIP = req.ip || req.connection.remoteAddress;
        console.log("clientIP", clientIP, req.headers['x-forwarded-for'], req.ip, req.connection.remoteAddress)
        const draftBlogs = await Blog.find({ status: 'Created' }).populate('lastModifiedBy', 'first_name last_name')
        // .populate('blogContent', 'header, serialNumber, content, image, youtubeVideoCode')
        
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

        const publishedBlogs = await Blog.find({status: "Unpublished"}).populate('lastModifiedBy', 'first_name last_name')
        
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
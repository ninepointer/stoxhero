const Course = require('../../models/courses/courseSchema');
const AWS = require('aws-sdk');
const { ObjectId } = require('mongodb');
const sharp = require('sharp');
const mongoose = require('mongoose');


const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// Function to upload a file to S3
const getAwsS3Url = async (file, type) => {
    if (file && type === 'Image') {
        file.buffer = await sharp(file.buffer)
            .resize({ width: 512, height: 256 })
            .toBuffer();
    }
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `school/${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
        // or another ACL according to your requirements
    };

    try {
        const uploadResult = await s3.upload(params).promise();
        return uploadResult.Location;
    } catch (error) {
        console.error(error);
        throw new Error('Error uploading file to S3');
    }
};



exports.createCourse = async (req, res) => {
    // Destructure fields from req.body
    const {
      courseName,
      courseInstructor,
      aboutInstructor,
      courseLanguages,
      courseDurationInMinutes,
      courseOverview,
      courseDescription,
      courseStartTime,
      courseEndTime,
      registrationStartTime,
      registrationEndTime,
      maxParticipants,
      coursePrice,
      discountedPrice,
      courseBenefits,
      courseContent,
      courseLink,
      commissionPercentage,
      tags,
      level,
    } = req.body;
    
    // Basic validation (example: check if courseName and coursePrice are provided)
    if (!courseName || coursePrice === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if(new Date(courseStartTime)>new Date(courseEndTime)){
        return res.status(400).json({ error: 'Start time can\'t be greater than end time'});
    }
    if(new Date(courseStartTime)<new Date(registrationStartTime)){
        return res.status(400).json({ error: 'Start time can\'t be greater than registration start time'});
    }
    let courseImage, salesVideo;
        if (req.files['courseImage']) {
            courseImage = await getAwsS3Url(req.files['logo'][0], 'Image');
        }

        if (req.files['salesVideo']) {
            salesVideo = await getAwsS3Url(req.files['image'][0], 'Video');
        }
    const courseSlug = courseName.replace(/ /g, "-").toLowerCase();
    try {
      // Create the course with validated and destructured data
      const course = new Course({
        courseName,
        courseSlug,
        courseInstructor,
        aboutInstructor,
        courseImage,
        courseLanguages,
        courseDurationInMinutes,
        courseOverview,
        courseImage,
        courseDescription,
        courseStartTime,
        courseEndTime,
        registrationStartTime,
        registrationEndTime,
        maxParticipants,
        coursePrice,
        discountedPrice,
        courseBenefits,
        courseContent,
        courseLink,
        commissionPercentage,
        tags,
        enrollments,
        level,
        salesVideo
      });
  
      await course.save();
      res.status(201).json({status:'success', message:'Course created successfully', data:course});
    } catch (error) {
      res.status(500).json({ status:'error' ,message:'Something went wrong', error: error.message });
    }
  };

  exports.getAllCourses = async (req, res) => {
    try {
      const courses = await Course.find();
      res.status(200).json({status:'success', data:courses});
    } catch (error) {
      res.status(500).json({ status:'error' ,message:'Something went wrong', error: error.message });
    }
  };
  
  // Get a course by ID
  exports.getCourseById = async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
      res.status(200).json({data:course, status:'success'});
    } catch (error) {
      res.status(500).json({ status:'error' ,message:'Something went wrong', error: error.message });
    }
  };
  
  // Update a course
  exports.editCourse = async (req, res) => {
    const updates = req.body;
    for(let elem in updates){
        if(updates[elem] === 'undefined' || updates[elem] === 'null'){
            updates[elem] = null;
        }

        if(updates[elem] === 'false'){
            updates[elem] = false;
        }

        if(updates[elem] === 'true'){
            updates[elem] = true;
        }
    }

    if (req.files['courseImage']) {
        updates.courseImage = await getAwsS3Url(req.files['courseImage'][0], 'Image');
    }
    if (req.files['salesVideo']) {
        updates.salesVideo = await getAwsS3Url(req.files['salesVideo'][0], 'Video');
    }

    try {
      const course = await Course.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
      if (!course) {
        return res.status(404).json({ status:'error', message: 'Course not found' });
      }
      res.status(200).json({status:'success',data:course});
    } catch (error) {
      res.status(400).json({ status:'error' ,message:'Something went wrong', error: error.message });
    }
  };
  
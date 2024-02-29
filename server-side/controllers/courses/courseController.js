const Course = require("../../models/courses/courseSchema");
const AWS = require("aws-sdk");
const { ObjectId } = require("mongodb");
const sharp = require("sharp");
const mongoose = require("mongoose");
const User = require('../../models/User/userDetailSchema');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Function to upload a file to S3
const getAwsS3Url = async (file, type) => {
  if (file && type === "Image") {
    file.buffer = await sharp(file.buffer)
      .resize({ width: 512, height: 256 })
      .toBuffer();
  }
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `courses/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
    // or another ACL according to your requirements
  };

  try {
    const uploadResult = await s3.upload(params).promise();
    return uploadResult.Location;
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file to S3");
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
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (new Date(courseStartTime) > new Date(courseEndTime)) {
    return res
      .status(400)
      .json({ error: "Start time can't be greater than end time" });
  }
  if (new Date(courseStartTime) < new Date(registrationStartTime)) {
    return res.status(400).json({
      error: "Start time can't be greater than registration start time",
    });
  }
  let courseImage, salesVideo;
  if (req.files["courseImage"]) {
    courseImage = await getAwsS3Url(req.files["logo"][0], "Image");
  }

  if (req.files["salesVideo"]) {
    salesVideo = await getAwsS3Url(req.files["image"][0], "Video");
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
      salesVideo,
    });

    await course.save();
    res.status(201).json({
      status: "success",
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getAdminPublished = async (req, res) => {
  try {
    const skip = Number(req.query.skip || 0);
    const limit = Number(req.query.limit || 10);
    const count = await Course.countDocuments({status: 'Published'})
    const courses = await Course.find({status: 'Published'})
    .sort({courseStartTime: -1})
    .skip(skip).limit(limit)
    res.status(200).json({ status: "success", data: courses, count: count });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getAdminAwaitingApproval = async (req, res) => {
  try {
    const skip = Number(req.query.skip || 0);
    const limit = Number(req.query.limit || 10);
    const count = await Course.countDocuments({status: 'Sent To Creator'})
    const courses = await Course.find({status: 'Sent To Creator'})
    .sort({courseStartTime: -1})
    .skip(skip).limit(limit)
    res.status(200).json({ status: "success", data: courses, count: count });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getAdminUnpublished = async (req, res) => {
  try {
    const skip = Number(req.query.skip || 0);
    const limit = Number(req.query.limit || 10);
    const count = await Course.countDocuments({status: 'Unpublished'})
    const courses = await Course.find({status: 'Unpublished'})
    .sort({courseStartTime: -1})
    .skip(skip).limit(limit)
    res.status(200).json({ status: "success", data: courses, count: count });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getAdminPendingApproval = async (req, res) => {
  try {
    const skip = Number(req.query.skip || 0);
    const limit = Number(req.query.limit || 10);
    const count = await Course.countDocuments({status: 'Pending Admin Approval'})
    const courses = await Course.find({status: 'Pending Admin Approval'})
    .sort({courseStartTime: -1})
    .skip(skip).limit(limit)
    res.status(200).json({ status: "success", data: courses, count: count });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getAdminDraft = async (req, res) => {
  try {
    const skip = Number(req.query.skip || 0);
    const limit = Number(req.query.limit || 10);
    const count = await Course.countDocuments({status: 'Draft'})
    const courses = await Course.find({status: 'Draft'})
    .sort({courseStartTime: -1})
    .skip(skip).limit(limit)
    res.status(200).json({ status: "success", data: courses, count: count });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const courses = await Course.findOne({_id: new ObjectId(courseId)})
    .populate('courseInstructors.id', 'first_name last_name email')
    .populate('enrollments.userId', 'first_name last_name creationProcess')
    res.status(200).json({ status: "success", data: courses });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};


exports.courseUnpublish = async (req, res) => {
  try {
    const courseId = req.params.id;
    const courses = await Course.findOneAndUpdate({_id: new ObjectId(courseId)}, {
      $set: {
        status: 'Unpublished'
      }
    });
    res.status(200).json({ status: "success", data: courses });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.coursePublish = async (req, res) => {
  try {
    const courseId = req.params.id;
    const courses = await Course.findOneAndUpdate({_id: new ObjectId(courseId)}, {
      $set: {
        status: 'Published'
      }
    });
    res.status(200).json({ status: "success", data: courses });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.creatorApproval = async (req, res) => {
  try {
    const courseId = req.params.id;
    const courses = await Course.findOneAndUpdate({_id: new ObjectId(courseId)}, {
      $set: {
        status: 'Sent To Creator'
      }
    });
    res.status(200).json({ status: "success", data: courses });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.sendAdminApproval = async (req, res) => {
  try {
    const courseId = req.params.id;
    const courses = await Course.findOneAndUpdate({_id: new ObjectId(courseId)}, {
      $set: {
        status: 'Pending Admin Approval'
      }
    });
    res.status(200).json({ status: "success", message: 'Your request has been sent for admin approval.' });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getCourseInstructor = async (req, res) => {
  try {
    const courseId = req.params.id;
    const courses = await Course.findOne({_id: new ObjectId(courseId)})
    .populate('courseInstructors.id', 'first_name last_name mobile email')
    .select('courseInstructors')
    res.status(200).json({ status: "success", data: courses });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getCourseFAQ = async (req, res) => {
  try {
    const courseId = req.params.id;
    const courses = await Course.findOne({_id: new ObjectId(courseId)})
    .select('faqs')
    res.status(200).json({ status: "success", data: courses });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getCourseBenefit = async (req, res) => {
  try {
    const courseId = req.params.id;
    const courses = await Course.findOne({_id: new ObjectId(courseId)})
    .select('courseBenefits')
    res.status(200).json({ status: "success", data: courses });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getCourseContent = async (req, res) => {
  try {
    const courseId = req.params.id;
    const courses = await Course.findOne({_id: new ObjectId(courseId)})
    .select('courseContent')
    res.status(200).json({ status: "success", data: courses });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};


exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ status: "success", data: courses });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.suggestChanges = async (req, res) => {
  try {
    const {change} = req.body;
    const course = await Course.findByIdAndUpdate(new ObjectId(req.params.id), {
      $push: {
        suggestChanges: change
      },
      $set: {
        status: 'Draft'
      }
    }, {new: true});
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ status: "success", message: 'Your changes have been successfully saved. Please check back later to see the updates.' });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};


exports.addInstructor = async (req, res) => {
  try {
    const {about, instructor} = req.body;
    let image;
    if (req.files["instructorImage"]) {
      image = await getAwsS3Url(req.files["instructorImage"][0]);
    }

    console.log('image', image)
    const course = await Course.findByIdAndUpdate(new ObjectId(req.params.id), {
      $push: {
        courseInstructors: {
          id: instructor,
          image, about
        }
      }
    }, {new: true, select: 'courseInstructors'});
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ data: course, status: "success" });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.addFaq = async (req, res) => {
  try {
    const {order, question, answer} = req.body;

    const course = await Course.findByIdAndUpdate(new ObjectId(req.params.id), {
      $push: {
        faqs: {
           question,
           answer, order
        }
      }
    }, {new: true, select: 'faqs'});
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ data: course, status: "success" });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.addBenefits = async (req, res) => {
  try {
    const {order, benefits} = req.body;

    const course = await Course.findByIdAndUpdate(new ObjectId(req.params.id), {
      $push: {
        courseBenefits: {
           benefits,
            order
        }
      }
    }, {new: true, select: 'courseBenefits'});
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ data: course, status: "success" });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.addContent = async (req, res) => {
  try {
    const {order, topic} = req.body;

    console.log(req.body, order, topic)

    const course = await Course.findByIdAndUpdate(new ObjectId(req.params.id), {
      $push: {
        courseContent: {
           topic,
           order
        }
      }
    }, {new: true, select: 'courseContent'});
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ data: course, status: "success" });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.addSubTopic = async (req, res) => {
  try {
      const { id, contentId } = req.params;
      let { order, topic } = req.body;

      const newOption = {
          order,
          topic
      };

      const course = await Course.findById(id);
      let filter = course.courseContent.filter((elem) => {
          return elem?._id?.toString() === contentId?.toString();
      })
      if (!course) {
          return res.status(404).json({ message: 'Course not found' });
      }
      filter[0].subtopics.push(newOption);
      const newData = await course.save({ new: true });

      const optionData = newData?.courseContent?.filter((elem) => {
          return elem?._id?.toString() === contentId?.toString();
      })
      res.status(201).json({ status: "success", data: optionData[0] });
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

exports.editInstructor = async (req, res) => {
  try {
    const {instructorId} = req.params;
    const {about, image} = req.body;
    const course = await Course.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
        "courseInstructors.id": instructorId // Match instructorId in courseInstructors
      },
      {
        $set: {
          "courseInstructors.$.image": image,
          "courseInstructors.$.about": about,
        }
      },
      { new: true, select: 'courseInstructors' }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ data: course, status: "success" });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.editFaq = async (req, res) => {
  try {
    const {faqId} = req.params;
    const {order, question, answer} = req.body;
    const course = await Course.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
        "faqs._id": faqId // Match instructorId in faqs
      },
      {
        $set: {
          "faqs.$.order": order,
          "faqs.$.question": question,
          "faqs.$.answer": answer,
        }
      },
      { new: true, select: 'faqs' }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ data: course, status: "success" });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.editBenefits = async (req, res) => {
  try {
    const {benefitId} = req.params;
    const {order, benefits} = req.body;
    const course = await Course.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
        "courseBenefits._id": benefitId // Match instructorId in courseBenefits
      },
      {
        $set: {
          "courseBenefits.$.order": order,
          "courseBenefits.$.benefits": benefits,
        }
      },
      { new: true, select: 'courseBenefits' }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ data: course, status: "success" });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.editContent = async (req, res) => {
  try {
    const {contentId} = req.params;
    const {order, topic} = req.body;
    console.log(req.body)
    const course = await Course.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
        "courseContent._id": contentId // Match instructorId in courseContent
      },
      {
        $set: {
          "courseContent.$.order": order,
          "courseContent.$.topic": topic,
        }
      },
      { new: true, select: 'courseContent' }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ data: course, status: "success" });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.editSubTopic = async (req, res) => {
  try {
      const { id, contentId, subtopicId } = req.params;
      let { order, topic } = req.body;

      const course = await Course.findById(id);
      if (!course) {
          return res.status(404).json({ message: 'Course not found' });
      }

      let filterContent = course.courseContent.filter((elem) => {
          return elem?._id?.toString() === contentId?.toString();
      })

      let filterSubtopic = filterContent[0]?.subtopics?.filter((elem) => {
          return elem?._id?.toString() === subtopicId?.toString();
      })

      filterSubtopic[0].order = order;
      filterSubtopic[0].topic = topic;

      const newData = await course.save({ new: true });

      let newfilterQue = newData.courseContent.filter((elem) => {
          return elem?._id?.toString() === contentId?.toString();
      })


      let newfilterOpt = newfilterQue[0]?.subtopics?.filter((elem) => {
          return elem?._id?.toString() === subtopicId?.toString();
      })

      res.status(201).json({ status: "success", data: newfilterQue[0]?.subtopics });
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

exports.deleteInstructor = async (req, res) => {
  try {
    const {instructorId} = req.params;
    const course = await Course.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $pull: {
          courseInstructors: { _id: instructorId } // Remove instructor with matching id
        }
      },
      { new: true, select: 'courseInstructors' }
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ data: course, status: "success" });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.deleteFAQ = async (req, res) => {
  try {
    const {faqId} = req.params;
    const course = await Course.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $pull: {
          faqs: { _id: faqId } // Remove instructor with matching id
        }
      },
      { new: true, select: 'faqs' }
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ data: course, status: "success" });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.deleteBenefits = async (req, res) => {
  try {
    const {benefitId} = req.params;
    const course = await Course.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $pull: {
          courseBenefits: { _id: benefitId } // Remove instructor with matching id
        }
      },
      { new: true, select: 'courseBenefits' }
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ data: course, status: "success" });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.deleteContent = async (req, res) => {
  try {
    const {contentId} = req.params;
    const course = await Course.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $pull: {
          courseContent: { _id: contentId } // Remove instructor with matching id
        }
      },
      { new: true, select: 'courseContent' }
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ data: course, status: "success" });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.deleteSubtopic = async (req, res) => {
  try {
    const { contentId, subtopicId } = req.params;

    // Find the matched course document
    let course = await Course.findOne({ _id: new ObjectId(req.params.id) });

    // Check if course exists
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Find the index of the matched courseContent element
    const index = course.courseContent.findIndex(content => content._id.toString() === contentId);

    // Check if contentId exists
    if (index === -1) {
      return res.status(404).json({ message: "Course content not found" });
    }

    // Remove the subtopic from the subtopics array
    course.courseContent[index].subtopics = course.courseContent[index].subtopics.filter(subtopic => subtopic._id.toString() !== subtopicId);

    // Save the updated course document
    course = await course.save();

    // Send response with the updated courseContent element
    res.status(200).json({ data: course.courseContent[index], status: "success" });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};


// Update a course
exports.editCourse = async (req, res) => {
  const updates = req.body;

  for (let elem in updates) {
    if (updates[elem] === "undefined" || updates[elem] === "null") {
      updates[elem] = null;
    }

    if (updates[elem] === "false") {
      updates[elem] = false;
    }

    if (updates[elem] === "true") {
      updates[elem] = true;
    }
  }

  if(updates.tags) updates.tags = updates.tags.split(",");

  if (req?.files?.["courseImage"]) {
    updates.courseImage = await getAwsS3Url(
      req.files["courseImage"][0],
      "Image"
    );
  }
  if (req?.files?.["salesVideo"]) {
    updates.salesVideo = await getAwsS3Url(req.files["salesVideo"][0], "Video");
  }

  const getCourse = await Course.findById(new ObjectId(req.params.id));
  updates.courseBenefits = getCourse.courseBenefits;
  updates.courseInstructors = getCourse.courseInstructors;
  updates.courseContent = getCourse.courseContent;
  updates.purchaseIntent = getCourse.purchaseIntent;
  updates.enrollments = getCourse.enrollments;
  updates.faqs = getCourse.faqs;

  try {
    const course = await Course.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!course) {
      return res
        .status(404)
        .json({ status: "error", message: "Course not found" });
    }
    res.status(200).json({ status: "success", data: course });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.createCourseInfo = async (req, res) => {
  const {
    courseName,
    courseOverview,
    courseLanguages,
    tags,
    category,
    level,
    maxEnrolments,
    courseType,
    courseDescription,
    courseStartTime,
    courseEndTime,
    registrationEndTime,
    registrationStartTime,
    courseDurationInMinutes,
    type
  } = req.body;

  if (!courseName) {
    return res
      .status(400)
      .json({ status: 'error', message: "Missing required fields" });
  }

  if (new Date(courseStartTime) > new Date(courseEndTime)) {
    return res
      .status(400)
      .json({ error: "Start time can't be greater than end time" });
  }
  if (new Date(courseStartTime) < new Date(registrationStartTime)) {
    return res.status(400).json({
      error: "Start time can't be greater than registration start time",
    });
  }
  let courseImage, salesVideo;
  if (req.files["courseImage"]) {
    courseImage = await getAwsS3Url(req.files["courseImage"][0], "Image");
  }

  if (req.files["salesVideo"]) {
    salesVideo = await getAwsS3Url(req.files["salesVideo"][0], "Video");
  }
  const courseSlug = courseName.replace(/ /g, "-").toLowerCase();
  try {
    const course = new Course({
      courseName,
      courseSlug,
      courseImage,
      courseLanguages,
      courseOverview,
      courseImage,
      courseDescription,
      courseStartTime,
      courseEndTime,
      registrationStartTime,
      registrationEndTime,
      maxEnrolments,
      tags,
      category,
      courseType,
      level,
      salesVideo,
      courseDurationInMinutes,
      type
    });

    await course.save();
    res.status(201).json({
      status: "success",
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.setPricing = async (req, res) => {
  const { coursePrice, discountedPrice, commissionPercentage } = req.body;
  console.log(req.body);
  const { id } = req.params;
  try {
    const course = await Course.findByIdAndUpdate(
      id,
      {
        coursePrice,
        discountedPrice,
        commissionPercentage,
      },
      {
        new: true,
        runValidators: false,
      }
    );
    res.status(200).json({
      status: "success",
      message: "Course Pricing added",
      data: course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};


exports.getInfluencerAllCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const skip = Number(req.query.skip || 0);
    const limit = Number(req.query.limit || 10);
    const count = await Course.countDocuments({
      "courseInstructors.id": new ObjectId(userId)
    })
    const courses = await Course.find({
      "courseInstructors.id": new ObjectId(userId)
    }).populate('enrollments.userId', 'first_name last_name creationProcess')
    .skip(skip).limit(limit)
    res.status(200).json({ status: "success", data: courses, count: count });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getAwaitingApprovals = async (req, res) => {
  try {
    const userId = req.user._id;
    const skip = Number(req.query.skip || 0);
    const limit = Number(req.query.limit || 10);
    const count = await Course.countDocuments({
      "courseInstructors.id": new ObjectId(userId),
      status: 'Sent To Creator'
    })
    const courses = await Course.aggregate([
      {
        $match: {
          status: "Sent To Creator",
          "courseInstructors.id": new ObjectId(
            userId
          ),
        },
      },
      {
        $sort: {
          courseStartTime: 1,
          _id: -1,
        },
      },
      {
        $project: {
          courseName: 1,
          courseStartTime: 1,
          courseImage: 1,
          userEnrolled: {
            $size: "$enrollments",
          },
          maxEnrolments: 1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ])
   
    res.status(200).json({ status: "success", data: courses, count: count });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getPendingApproval = async (req, res) => {
  try {
    const userId = req.user._id;
    const skip = Number(req.query.skip || 0);
    const limit = Number(req.query.limit || 10);
    const count = await Course.countDocuments({
      "courseInstructors.id": new ObjectId(userId),
      status: 'Pending Admin Approval'
    })
    const courses = await Course.aggregate([
      {
        $match: {
          status: "Pending Admin Approval",
          "courseInstructors.id": new ObjectId(
            userId
          ),
        },
      },
      {
        $sort: {
          courseStartTime: 1,
          _id: -1,
        },
      },
      {
        $project: {
          courseName: 1,
          courseStartTime: 1,
          courseImage: 1,
          userEnrolled: {
            $size: "$enrollments",
          },
          maxEnrolments: 1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ])
   
    res.status(200).json({ status: "success", data: courses, count: count });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getPublished = async (req, res) => {
  try {
    const userId = req.user._id;
    const skip = Number(req.query.skip || 0);
    const limit = Number(req.query.limit || 10);
    const count = await Course.countDocuments({
      "courseInstructors.id": new ObjectId(userId),
      status: 'Published'
    })
    const courses = await Course.aggregate([
      {
        $match: {
          status: "Published",
          "courseInstructors.id": new ObjectId(
            userId
          ),
        },
      },
      {
        $sort: {
          courseStartTime: 1,
          _id: -1,
        },
      },
      {
        $project: {
          courseName: 1,
          courseStartTime: 1,
          courseImage: 1,
          userEnrolled: {
            $size: "$enrollments",
          },
          maxEnrolments: 1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ])
   
    res.status(200).json({ status: "success", data: courses, count: count });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getUnpublished = async (req, res) => {
  try {
    const userId = req.user._id;
    const skip = Number(req.query.skip || 0);
    const limit = Number(req.query.limit || 10);
    const count = await Course.countDocuments({
      "courseInstructors.id": new ObjectId(userId),
      status: 'Unpublished'
    })
    const courses = await Course.aggregate([
      {
        $match: {
          status: "Unpublished",
          "courseInstructors.id": new ObjectId(
            userId
          ),
        },
      },
      {
        $sort: {
          courseStartTime: 1,
          _id: -1,
        },
      },
      {
        $project: {
          courseName: 1,
          courseStartTime: 1,
          courseImage: 1,
          userEnrolled: {
            $size: "$enrollments",
          },
          maxEnrolments: 1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ])
   
    res.status(200).json({ status: "success", data: courses, count: count });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getMyCourses = async (req, res) => {
  try{
    const userId = req.user._id;
    const user = await User.findById(new ObjectId(userId));
    const skip = Number(req.query.skip || 0);
    const limit = Number(req.query.limit || 10);

    const pipeline = [
      {
        $match: {
          status: "Published"
        }
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "courseInstructors.id",
          foreignField: "_id",
          as: "instructor"
        }
      },
      {
        $sort: {
          courseStartTime: 1,
          _id: -1
        }
      },
      {
        $project: {
          courseName: 1,
          courseStartTime: 1,
          courseImage: 1,
          coursePrice: 1,
          discountedPrice: 1,
          userEnrolled: {
            $size: "$enrollments"
          },
          maxEnrolments: 1,
          instructorName: {
            $map: {
              input: "$instructor",
              as: "inst",
              in: {
                $concat: [
                  "$$inst.first_name",
                  " ",
                  "$$inst.last_name"
                ]
              }
            }
          }
        }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]
    
    let course; let count;
    if(user?.referredBy){

      pipeline[0]["$match"]['courseInstructors.id'] = new ObjectId(user?.referredBy);
      course = await Course.aggregate(pipeline)
      .sort({courseStartTime: 1}).skip(skip).limit(limit);
      
      count = await Course.countDocuments({status: 'Published', 'courseInstructors.id': new ObjectId(user?.referredBy)});
    } else{
      count = await Course.countDocuments({status: 'Published'});

      course = await Course.aggregate(pipeline)
      .sort({courseStartTime: 1}).skip(skip).limit(limit);
    }
    
    res.status(200).json({ status: "success", data: course, count: count });

  } catch(err){
    console.log(err)
    res.status(500).json({ status: "error", message: 'something went wrong' });
  }
}

exports.getCourseByIdUser = async (req, res) => {
  try {
    const courseId = req.params.id;
    const courses = await Course.findOne({_id: new ObjectId(courseId)})
    .populate('courseInstructors.id', 'first_name last_name email')
    .select('-enrollments -createdOn -createdBy')
    res.status(200).json({ status: "success", data: courses });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getCoursesByUserSlug = async (req, res) => {
  try{
    const slug = req.query.slug;
    const user = await User.findOne({slug: slug}).select('_id')
    const skip = Number(req.query.skip || 0);
    const limit = Number(req.query.limit || 10);

    const pipeline = [
      {
        $match: {
          status: "Published",
          'courseInstructors.id': new ObjectId(user?._id)
        }
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "courseInstructors.id",
          foreignField: "_id",
          as: "instructor"
        }
      },
      {
        $sort: {
          courseStartTime: 1,
          _id: -1
        }
      },
      {
        $project: {
          courseName: 1,
          courseStartTime: 1,
          courseSlug: 1,
          courseImage: 1,
          coursePrice: 1,
          discountedPrice: 1,
          userEnrolled: {
            $size: "$enrollments"
          },
          maxEnrolments: 1,
          instructorName: {
            $map: {
              input: "$instructor",
              as: "inst",
              in: {
                $concat: [
                  "$$inst.first_name",
                  " ",
                  "$$inst.last_name"
                ]
              }
            }
          }
        }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]
    
    const course = await Course.aggregate(pipeline)
    .sort({courseStartTime: 1}).skip(skip).limit(limit);
    
    const count = await Course.countDocuments({status: 'Published', 'courseInstructors.id': new ObjectId(user?._id)});

    res.status(200).json({ status: "success", data: course, count: count });

  } catch(err){
    console.log(err)
    res.status(500).json({ status: "error", message: 'something went wrong' });
  }
}


exports.getCourseBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const courses = await Course.findOne({courseSlug: slug})
    .populate('courseInstructors.id', 'first_name last_name email')
    .select('-enrollments -createdOn -createdBy')
    res.status(200).json({ status: "success", data: courses });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};
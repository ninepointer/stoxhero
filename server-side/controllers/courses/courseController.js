const Course = require("../../models/courses/courseSchema");
const AWS = require("aws-sdk");
const { ObjectId } = require("mongodb");
const sharp = require("sharp");
const mongoose = require("mongoose");
const uuid = require("uuid");
const {
  createUserNotification,
} = require("../notification/notificationController");
const { sendMultiNotifications } = require("../../utils/fcmService");
const { saveSuccessfulCouponUse } = require("../coupon/couponController");
const User = require("../../models/User/userDetailSchema");
const UserWallet = require("../../models/UserWallet/userWalletSchema");
const Setting = require("../../models/settings/setting");
const Coupon = require("../../models/coupon/coupon");
const AffiliateProgram = require("../../models/affiliateProgram/affiliateProgram");
const ReferralProgram = require("../../models/campaigns/referralProgram");
// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
// const { streamUpload } = require("@uppy/companion");
const Product = require("../../models/Product/product");
const {
  creditAffiliateAmount,
} = require("../affiliateProgramme/affiliateController");
const emailService = require("../../utils/emailService");
const InfluencerTransaction = require("../../models/Influencer/influencer-transaction");
const moment = require("moment");
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Function to upload a file to S3
const getAwsS3Url = async (file, type, width = 512, height = 256) => {
  if (file && type === "Image") {
    file.buffer = await sharp(file.buffer)
      .resize({ width: width, height: height })
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

const getAwsS3CoverImageUrl = async (file, type) => {
  if (file && type === "Image") {
    file.buffer = await sharp(file.buffer)
      .resize({ width: 1536, height: 768 })
      .toBuffer();
  }

  console.log(file.buffer);
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
const getAwsS3Key = async (file, type, key) => {
  if (file && type === "Image") {
    file.buffer = await sharp(file.buffer)
      .resize({ width: 512, height: 256 })
      .toBuffer();
  }
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key ? key : `courses/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
    // or another ACL according to your requirements
  };

  try {
    const uploadResult = await s3.upload(params).promise();
    return { url: uploadResult.Location, key: key };
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading file to S3");
  }
};

exports.createCourse = async (req, res) => {
  // Destructure fields from req.body
  for (let elem in req.body) {
    if (req.body[elem] === "undefined" || req.body[elem] === "null") {
      req.body[elem] = null;
    }

    if (req.body[elem] === "false") {
      req.body[elem] = false;
    }

    if (req.body[elem] === "true") {
      req.body[elem] = true;
    }
  }
  const {
    courseName,
    courseLanguages,
    courseDurationInMinutes,
    courseOverview,
    courseDescription,
    courseStartTime,
    courseEndTime,
    registrationStartTime,
    registrationEndTime,
    maxEnrolments,
    coursePrice,
    discountedPrice,
    courseBenefits,
    courseContent,
    courseLink,
    commissionPercentage,
    tags,
    type,
    courseType,
    level,
    bestSeller,
    category,
    meetLink,
    metaTitle,
    metaDescription,
    metaKeywords,
  } = req.body;

  // Basic validation (example: check if courseName and coursePrice are provided)
  if (!courseName) {
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
  let courseImage, salesVideo, coverImage;
  if (req.files["courseImage"]) {
    courseImage = await getAwsS3Url(req.files["courseImage"][0], "Image");

    if (type === "Workshop")
      coverImage = await getAwsS3CoverImageUrl(
        req.files["courseImage"][0],
        "Image"
      );
  }

  if (req.files["salesVideo"]) {
    salesVideo = await getAwsS3Url(req.files["salesVideo"][0], "Video");
  }
  const courseSlug = courseName.replace(/ /g, "-").toLowerCase();
  try {
    // Create the course with validated and destructured data
    const course = new Course({
      courseName,
      courseSlug,
      courseImage,
      courseLanguages,
      courseDurationInMinutes: Math.abs(Number(courseDurationInMinutes)),
      courseOverview,
      courseDescription,
      ...(courseType !== "Recorded" && {
        courseStartTime,
        courseEndTime,
        registrationStartTime,
        registrationEndTime,
      }),
      maxEnrolments,
      workshopCoverImage: coverImage,
      coursePrice,
      discountedPrice,
      courseBenefits,
      courseContent,
      courseLink,
      commissionPercentage,
      tags,
      level,
      salesVideo,
      bestSeller,
      category,
      courseType,
      type,
      meetLink,
      metaTitle,
      metaDescription,
      metaKeywords,
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
    const skip = Number(Number(req.query.skip) || 0);
    const limit = Number(Number(req.query.limit) || 10);
    const count = await Course.countDocuments({ status: "Published" });
    const courses = await Course.find({ status: "Published" })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);
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
    const skip = Number(Number(req.query.skip) || 0);
    const limit = Number(Number(req.query.limit) || 10);
    const count = await Course.countDocuments({ status: "Sent To Creator" });
    const courses = await Course.find({ status: "Sent To Creator" })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);
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
    const skip = Number(Number(req.query.skip) || 0);
    const limit = Number(Number(req.query.limit) || 10);
    const count = await Course.countDocuments({ status: "Unpublished" });
    const courses = await Course.find({ status: "Unpublished" })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);
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
    const skip = Number(Number(req.query.skip) || 0);
    const limit = Number(Number(req.query.limit) || 10);
    const count = await Course.countDocuments({
      status: "Pending Admin Approval",
    });
    const courses = await Course.find({ status: "Pending Admin Approval" })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);
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
    const skip = Number(Number(req.query.skip) || 0);
    const limit = Number(Number(req.query.limit) || 10);
    const count = await Course.countDocuments({ status: "Draft" });
    const courses = await Course.find({ status: "Draft" })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);
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
    const courses = await Course.findOne({ _id: new ObjectId(courseId) })
      .populate("courseInstructors.id", "first_name last_name email")
      .populate(
        "enrollments.userId",
        "first_name last_name creationProcess joining_date referredBy enrolledOn mobile"
      ); // Make sure to include enrolledOn in the fields to populate

    const newCourse = JSON.parse(JSON.stringify(courses));

    // Sort the enrollments array by enrolledOn in descending order
    if (newCourse.enrollments && newCourse.enrollments.length > 0) {
      newCourse.enrollments.sort(
        (a, b) => new Date(b.enrolledOn) - new Date(a.enrolledOn)
      );
    }

    for (const subelem of newCourse?.courseContent) {
      for (const topics of subelem?.subtopics) {
        delete topics.videoUrl;
        delete topics.videoKey;
        delete topics.notes;
      }
    }

    res.status(200).json({ status: "success", data: newCourse });
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
    const courses = await Course.findOneAndUpdate(
      { _id: new ObjectId(courseId) },
      {
        $set: {
          status: "Unpublished",
        },
      }
    );
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
    const courses = await Course.findOneAndUpdate(
      { _id: new ObjectId(courseId) },
      {
        $set: {
          status: "Published",
        },
      }
    );
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
    const courses = await Course.findOneAndUpdate(
      { _id: new ObjectId(courseId) },
      {
        $set: {
          status: "Sent To Creator",
        },
      }
    );

    for (let elem of courses?.courseInstructors) {
      await createUserNotification({
        title: "For Approval",
        description: `Your approval is pending of ${courses?.courseName}`,
        notificationType: "Individual",
        notificationCategory: "Informational",
        productCategory: "Course",
        user: elem?.id,
        priority: "Medium",
        channels: ["App", "Email"],
        createdBy: "63ecbc570302e7cf0153370c",
        lastModifiedBy: "63ecbc570302e7cf0153370c",
      });
    }

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
    const courses = await Course.findOneAndUpdate(
      { _id: new ObjectId(courseId) },
      {
        $set: {
          status: "Pending Admin Approval",
        },
      }
    );
    res.status(200).json({
      status: "success",
      message: "Your request has been sent for admin approval.",
    });
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
    const courses = await Course.findOne({ _id: new ObjectId(courseId) })
      .populate("courseInstructors.id", "first_name last_name mobile email")
      .select("courseInstructors");
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
    const courses = await Course.findOne({
      _id: new ObjectId(courseId),
    }).select("faqs");
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
    const courses = await Course.findOne({
      _id: new ObjectId(courseId),
    }).select("courseBenefits");
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
    const courses = await Course.findOne({
      _id: new ObjectId(courseId),
    }).select("courseContent");
    res.status(200).json({ status: "success", data: courses });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getCourseContentTopic = async (req, res) => {
  try {
    const courseId = req.params.id;
    const contentId = req.params.contentId;
    const courses = await Course.findOne({
      _id: new ObjectId(courseId),
    }).select("courseContent");
    const content = courses?.courseContent?.filter(
      (item) => item?._id?.toString() == contentId?.toString()
    );
    res.status(200).json({ status: "success", data: content[0] });
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
    const { change } = req.body;
    const course = await Course.findByIdAndUpdate(
      new ObjectId(req.params.id),
      {
        $push: {
          suggestChanges: change,
        },
        $set: {
          status: "Draft",
        },
      },
      { new: true }
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({
      status: "success",
      message:
        "Your changes have been successfully saved. Please check back later to see the updates.",
    });
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
    const { about, instructor } = req.body;
    let image;
    if (req.files["instructorImage"]) {
      image = await getAwsS3Url(req.files["instructorImage"][0]);
    }

    console.log("image", image);
    const course = await Course.findByIdAndUpdate(
      new ObjectId(req.params.id),
      {
        $push: {
          courseInstructors: {
            id: instructor,
            image,
            about,
          },
        },
      },
      { new: true, select: "courseInstructors" }
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

exports.addFaq = async (req, res) => {
  try {
    const { order, question, answer } = req.body;

    const course = await Course.findByIdAndUpdate(
      new ObjectId(req.params.id),
      {
        $push: {
          faqs: {
            question,
            answer,
            order,
          },
        },
      },
      { new: true, select: "faqs" }
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

exports.addBenefits = async (req, res) => {
  try {
    const { order, benefits } = req.body;

    const course = await Course.findByIdAndUpdate(
      new ObjectId(req.params.id),
      {
        $push: {
          courseBenefits: {
            benefits,
            order,
          },
        },
      },
      { new: true, select: "courseBenefits" }
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

exports.addContent = async (req, res) => {
  try {
    const { order, topic } = req.body;

    console.log(req.body, order, topic);

    const course = await Course.findByIdAndUpdate(
      new ObjectId(req.params.id),
      {
        $push: {
          courseContent: {
            topic,
            order,
          },
        },
      },
      { new: true, select: "courseContent" }
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

exports.addSubTopic = async (req, res) => {
  try {
    const { id, contentId } = req.params;
    let { order, topic } = req.body;

    // Handle video upload
    const videoUrl = await getAwsS3Key(
      req.files["fileVid"][0],
      "Video",
      `courses/video/${req.params.id}-${topic}-${Date.now()}`
    );

    // Handle PDF files upload
    const pdfFiles = req.files["pdfFiles"];

    // Process PDF files and upload to storage if needed

    const newOption = {
      order,
      topic,
      videoUrl: videoUrl.url,
      videoKey: videoUrl.key,
      notes: [], // Initialize notes array
    };

    // Push PDF files' URLs/keys to the notes array
    if (pdfFiles) {
      for (const pdfFile of pdfFiles) {
        const pdfUrl = await getAwsS3Key(
          pdfFile,
          "PDF",
          `courses/notes/${req.params.id}-${topic}-${Date.now()}`
        );
        newOption.notes.push(pdfUrl.url);
      }
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    let filter = course.courseContent.filter((elem) => {
      return elem?._id?.toString() === contentId?.toString();
    });

    filter[0].subtopics.push(newOption);

    const newData = await course.save({
      new: true,
      validateBeforeSave: false,
    });

    const optionData = newData?.courseContent?.filter((elem) => {
      return elem?._id?.toString() === contentId?.toString();
    });

    res.status(201).json({ status: "success", data: optionData[0] });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.editInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const { about, image } = req.body;
    let imageUrl;
    if (req?.files?.["instructorImage"]) {
      imageUrl = await getAwsS3Url(
        req.files["instructorImage"][0],
        "Image",
        512,
        512
      );
    }
    const course = await Course.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
        "courseInstructors._id": instructorId, // Match instructorId in courseInstructors
      },
      {
        $set: {
          "courseInstructors.$.image": imageUrl,
          "courseInstructors.$.about": about,
        },
      },
      { new: true, select: "courseInstructors" }
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
    const { faqId } = req.params;
    const { order, question, answer } = req.body;
    const course = await Course.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
        "faqs._id": faqId, // Match instructorId in faqs
      },
      {
        $set: {
          "faqs.$.order": order,
          "faqs.$.question": question,
          "faqs.$.answer": answer,
        },
      },
      { new: true, select: "faqs" }
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
    const { benefitId } = req.params;
    const { order, benefits } = req.body;
    const course = await Course.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
        "courseBenefits._id": benefitId, // Match instructorId in courseBenefits
      },
      {
        $set: {
          "courseBenefits.$.order": order,
          "courseBenefits.$.benefits": benefits,
        },
      },
      { new: true, select: "courseBenefits" }
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
    const { contentId } = req.params;
    const { order, topic } = req.body;
    console.log(req.body);
    const course = await Course.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
        "courseContent._id": contentId, // Match instructorId in courseContent
      },
      {
        $set: {
          "courseContent.$.order": order,
          "courseContent.$.topic": topic,
        },
      },
      { new: true, select: "courseContent" }
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
    let videoUrl;

    // Handle video upload if provided
    if (req.files["fileVid"]?.length > 0) {
      const videoKey = await getAwsS3Key(
        req.files["fileVid"][0],
        "Video",
        `courses/video/${req.params.id}-${topic}-${Date.now()}`
      );
      videoUrl = videoKey.url;
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    let filterContent = course.courseContent.find(
      (elem) => elem?._id?.toString() === contentId?.toString()
    );

    let filterSubtopic = filterContent?.subtopics?.find(
      (elem) => elem?._id?.toString() === subtopicId?.toString()
    );

    filterSubtopic.order = order;
    filterSubtopic.topic = topic;
    if (videoUrl) {
      filterSubtopic.videoUrl = videoUrl;
    }

    // Handle PDF uploads if provided
    if (req.files["pdfFiles"]?.length > 0) {
      filterSubtopic.notes = filterSubtopic.notes || [];
      for (const pdfFile of req.files["pdfFiles"]) {
        const pdfKey = await getAwsS3Key(
          pdfFile,
          "PDF",
          `courses/pdf/${req.params.id}-${topic}-${Date.now()}`
        );
        filterSubtopic.notes.push(pdfKey.url);
      }
    }

    await course.save({ validateBeforeSave: false });

    res.status(201).json({
      status: "success",
      data: filterContent.subtopics,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const course = await Course.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $pull: {
          courseInstructors: { _id: instructorId }, // Remove instructor with matching id
        },
      },
      { new: true, select: "courseInstructors" }
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
    const { faqId } = req.params;
    const course = await Course.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $pull: {
          faqs: { _id: faqId }, // Remove instructor with matching id
        },
      },
      { new: true, select: "faqs" }
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
    const { benefitId } = req.params;
    const course = await Course.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $pull: {
          courseBenefits: { _id: benefitId }, // Remove instructor with matching id
        },
      },
      { new: true, select: "courseBenefits" }
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
    const { contentId } = req.params;
    const course = await Course.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $pull: {
          courseContent: { _id: contentId }, // Remove instructor with matching id
        },
      },
      { new: true, select: "courseContent" }
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
    const index = course.courseContent.findIndex(
      (content) => content._id.toString() === contentId
    );

    // Check if contentId exists
    if (index === -1) {
      return res.status(404).json({ message: "Course content not found" });
    }

    // Remove the subtopic from the subtopics array
    course.courseContent[index].subtopics = course.courseContent[
      index
    ].subtopics.filter((subtopic) => subtopic._id.toString() !== subtopicId);

    // Save the updated course document
    course = await course.save();

    // Send response with the updated courseContent element
    res
      .status(200)
      .json({ data: course.courseContent[index], status: "success" });
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

  if (updates.tags) updates.tags = updates.tags.split(",");

  if (req?.files?.["courseImage"]) {
    if (updates?.type === "Workshop") {
      updates.workshopCoverImage = await getAwsS3CoverImageUrl(
        req.files["courseImage"][0],
        "Image"
      );
    }
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
    type,
  } = req.body;

  if (!courseName) {
    return res
      .status(400)
      .json({ status: "error", message: "Missing required fields" });
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
      courseDescription,
      ...(courseType !== "Recorded" && {
        courseStartTime,
        courseEndTime,
        registrationStartTime,
        registrationEndTime,
      }),
      maxEnrolments,
      tags,
      category,
      courseType,
      level,
      salesVideo,
      courseDurationInMinutes,
      type,
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
    const skip = Number(Number(req.query.skip) || 0);
    const limit = Number(Number(req.query.limit) || 10);
    const count = await Course.countDocuments({
      "courseInstructors.id": new ObjectId(userId),
    });
    const courses = await Course.find({
      "courseInstructors.id": new ObjectId(userId),
    })
      .populate("enrollments.userId", "first_name last_name creationProcess")
      .skip(skip)
      .limit(limit);
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
    const skip = Number(Number(req.query.skip) || 0);
    const limit = Number(Number(req.query.limit) || 10);
    const count = await Course.countDocuments({
      "courseInstructors.id": new ObjectId(userId),
      status: "Sent To Creator",
      type: "Course",
    });
    const courses = await Course.aggregate([
      {
        $match: {
          status: "Sent To Creator",
          "courseInstructors.id": new ObjectId(userId),
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $addFields: {
          averageRating: { $ifNull: [{ $avg: "$ratings.rating" }, 0] }, // Calculate the average rating or set it to 0 if null
        },
      },
      {
        $project: {
          courseName: 1,
          _id: -1,
          courseImage: 1,
          coursePrice: 1,
          courseOverview: 1,
          registrationStartTime: 1,
          registrationEndTime: 1,
          courseStartTime: 1,
          courseEndTime: 1,
          courseType: 1,
          discountedPrice: 1,
          courseDurationInMinutes: 1,
          courseType: 1,
          type: 1,
          category: 1,
          level: 1,
          lectures: {
            $sum: {
              $map: {
                input: "$courseContent",
                as: "content",
                in: {
                  $size: "$$content.subtopics",
                },
              },
            },
          },
          averageRating: 1,
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
    ]);

    res.status(200).json({
      status: "success",
      data: courses.filter((elem) => elem?.type === "Course"),
      workshop: courses.filter((elem) => elem?.type === "Workshop"),
      count: count,
    });
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
    const skip = Number(Number(req.query.skip) || 0);
    const limit = Number(Number(req.query.limit) || 10);
    const count = await Course.countDocuments({
      "courseInstructors.id": new ObjectId(userId),
      status: "Pending Admin Approval",
      type: "Course",
    });
    const courses = await Course.aggregate([
      {
        $match: {
          status: "Pending Admin Approval",
          "courseInstructors.id": new ObjectId(userId),
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $addFields: {
          averageRating: { $ifNull: [{ $avg: "$ratings.rating" }, 0] }, // Calculate the average rating or set it to 0 if null
        },
      },
      {
        $project: {
          courseName: 1,
          _id: -1,
          courseImage: 1,
          courseOverview: 1,
          coursePrice: 1,
          discountedPrice: 1,
          registrationStartTime: 1,
          registrationEndTime: 1,
          courseStartTime: 1,
          courseEndTime: 1,
          courseType: 1,
          courseDurationInMinutes: 1,
          courseType: 1,
          type: 1,
          category: 1,
          level: 1,
          lectures: {
            $sum: {
              $map: {
                input: "$courseContent",
                as: "content",
                in: {
                  $size: "$$content.subtopics",
                },
              },
            },
          },
          averageRating: 1,
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
    ]);

    res.status(200).json({
      status: "success",
      data: courses.filter((elem) => elem?.type === "Course"),
      workshop: courses.filter((elem) => elem?.type === "Workshop"),
      count: count,
    });
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
    const skip = Number(Number(req.query.skip) || 0);
    const limit = Number(Number(req.query.limit) || 10);
    const count = await Course.countDocuments({
      "courseInstructors.id": new ObjectId(userId),
      courseEndTime: { $gte: new Date() },
      status: "Published",
      type: "Course",
    });
    const courses = await Course.aggregate([
      {
        $match: {
          status: "Published",
          "courseInstructors.id": new ObjectId(userId),
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $addFields: {
          averageRating: { $ifNull: [{ $avg: "$ratings.rating" }, 0] }, // Calculate the average rating or set it to 0 if null
        },
      },
      {
        $project: {
          courseName: 1,
          _id: -1,
          courseImage: 1,
          courseOverview: 1,
          coursePrice: 1,
          discountedPrice: 1,
          registrationStartTime: 1,
          registrationEndTime: 1,
          courseStartTime: 1,
          courseEndTime: 1,
          courseType: 1,
          courseDurationInMinutes: 1,
          type: 1,
          status: 1,
          category: 1,
          level: 1,
          lectures: {
            $sum: {
              $map: {
                input: "$courseContent",
                as: "content",
                in: {
                  $size: "$$content.subtopics",
                },
              },
            },
          },
          averageRating: 1,
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
    ]);

    const newCourse = courses
      .filter((elem) => elem?.type === "Course")
      .filter((elem, index) => {
        // console.log('name', elem?.courseName, index);
        if (
          elem?.courseType === "Live" &&
          elem?.registrationStartTime &&
          elem?.courseEndTime
        ) {
          // console.log('name', elem?.courseName, index);
          return (
            elem?.courseEndTime && new Date(elem?.courseEndTime) >= new Date()
          );
        } else {
          return elem;
        }
      });

    res.status(200).json({
      status: "success",
      data: newCourse,
      workshop: courses.filter(
        (elem) =>
          elem?.type === "Workshop" &&
          elem?.courseEndTime &&
          elem?.courseEndTime >= new Date()
      ),
      count: count,
    });
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
    const skip = Number(Number(req.query.skip) || 0);
    const limit = Number(Number(req.query.limit) || 10);
    const count = await Course.countDocuments({
      "courseInstructors.id": new ObjectId(userId),
      status: "Unpublished",
      type: "Course",
    });
    const courses = await Course.aggregate([
      {
        $match: {
          status: "Unpublished",
          "courseInstructors.id": new ObjectId(userId),
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $addFields: {
          averageRating: { $ifNull: [{ $avg: "$ratings.rating" }, 0] }, // Calculate the average rating or set it to 0 if null
        },
      },
      {
        $project: {
          courseName: 1,
          _id: -1,
          courseImage: 1,
          courseOverview: 1,
          coursePrice: 1,
          discountedPrice: 1,
          courseDurationInMinutes: 1,
          courseType: 1,
          registrationStartTime: 1,
          registrationEndTime: 1,
          courseStartTime: 1,
          courseEndTime: 1,
          courseType: 1,
          type: 1,
          status: 1,
          category: 1,
          level: 1,
          lectures: {
            $sum: {
              $map: {
                input: "$courseContent",
                as: "content",
                in: {
                  $size: "$$content.subtopics",
                },
              },
            },
          },
          averageRating: 1,
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
    ]);

    res.status(200).json({
      status: "success",
      workshop: courses.filter((elem) => elem?.type === "Workshop"),
      data: courses.filter((elem) => elem?.type === "Course"),
      count: count,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getInfluencerCompleted = async (req, res) => {
  try {
    const userId = req.user._id;
    const skip = Number(Number(req.query.skip) || 0);
    const limit = Number(Number(req.query.limit) || 10);
    const count = await Course.countDocuments({
      "courseInstructors.id": new ObjectId(userId),
      status: "Published",
      type: "Course",
      courseEndTime: { $lt: new Date() },
    });
    const courses = await Course.aggregate([
      {
        $match: {
          status: "Published",
          courseEndTime: { $lt: new Date() },
          "courseInstructors.id": new ObjectId(userId),
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $addFields: {
          averageRating: { $ifNull: [{ $avg: "$ratings.rating" }, 0] }, // Calculate the average rating or set it to 0 if null
        },
      },
      {
        $project: {
          courseName: 1,
          _id: -1,
          courseImage: 1,
          courseOverview: 1,
          coursePrice: 1,
          discountedPrice: 1,
          courseDurationInMinutes: 1,
          courseType: 1,
          registrationStartTime: 1,
          registrationEndTime: 1,
          courseStartTime: 1,
          courseEndTime: 1,
          courseType: 1,
          type: 1,
          status: 1,
          category: 1,
          level: 1,
          lectures: {
            $sum: {
              $map: {
                input: "$courseContent",
                as: "content",
                in: {
                  $size: "$$content.subtopics",
                },
              },
            },
          },
          averageRating: 1,
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
    ]);

    res.status(200).json({
      status: "success",
      workshop: courses.filter((elem) => elem?.type === "Workshop"),
      data: courses.filter((elem) => elem?.type === "Course"),
      count: count,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getUserWorkshop = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(new ObjectId(userId)).populate(
      "referredBy",
      "role"
    );

    const pipeline = [
      {
        $addFields: {
          isPaid: {
            $in: [new ObjectId(userId), "$enrollments.userId"],
          },
        },
      },
      {
        $match: {
          status: "Published",
          type: "Workshop",
          $and: [
            { registrationStartTime: { $lt: new Date() } },
            // { registrationEndTime: { $gte: new Date() } }
          ],
          $or: [
            {
              $and: [{ isPaid: true }, { courseEndTime: { $gte: new Date() } }],
            },
            {
              $and: [
                { isPaid: false },
                { registrationEndTime: { $gte: new Date() } },
              ],
            },
          ],
        },
      },
      {
        $addFields: {
          averageRating: { $ifNull: [{ $avg: "$ratings.rating" }, 0] }, // Calculate the average rating or set it to 0 if null
        },
      },
      {
        $project: {
          courseName: 1,
          _id: -1,
          meetLink: 1,
          courseImage: 1,
          courseSlug: 1,
          courseOverview: 1,
          coursePrice: 1,
          discountedPrice: 1,
          averageRating: 1,
          courseDurationInMinutes: 1,
          courseType: 1,
          registrationStartTime: 1,
          registrationEndTime: 1,
          courseStartTime: 1,
          courseEndTime: 1,
          type: 1,
          category: 1,
          level: 1,
          userEnrolled: {
            $size: "$enrollments",
          },
          maxEnrolments: 1,
          isPaid: {
            $in: [new ObjectId(userId), "$enrollments.userId"],
          },
        },
      },
      {
        $sort: {
          courseStartTime: -1,
          _id: -1,
        },
      },
    ];

    let course;
    if (
      user?.referredBy?._id &&
      user?.referredBy?.role?.toString() === "65dc6817586cba2182f05561"
    ) {
      pipeline[1]["$match"]["courseInstructors.id"] = new ObjectId(
        user?.referredBy
      );
      course = await Course.aggregate(pipeline);
    } else {
      course = await Course.aggregate(pipeline);
    }

    res.status(200).json({ status: "success", data: course });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "something went wrong" });
  }
};

exports.getUserCourses = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(new ObjectId(userId)).populate(
      "referredBy",
      "role"
    );
    const skip = Number(Number(req.query.skip) || 0);
    const limit = Number(Number(req.query.limit) || 10);

    const pipeline = [
      {
        $match: {
          status: "Published",
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "courseInstructors.id",
          foreignField: "_id",
          as: "instructor",
        },
      },
      {
        $addFields: {
          averageRating: { $ifNull: [{ $avg: "$ratings.rating" }, 0] }, // Calculate the average rating or set it to 0 if null
        },
      },
      {
        $project: {
          courseName: 1,
          _id: -1,
          courseImage: 1,
          courseSlug: 1,
          meetLink: 1,
          instructorImage: {
            $arrayElemAt: ["$courseInstructors.image", 0],
          },
          courseOverview: 1,
          coursePrice: 1,
          discountedPrice: 1,
          averageRating: 1,
          courseDurationInMinutes: 1,
          courseLanguages: 1,
          registrationStartTime: 1,
          registrationEndTime: 1,
          courseStartTime: 1,
          courseEndTime: 1,
          courseType: 1,
          type: 1,
          category: 1,
          level: 1,
          lectures: {
            $sum: {
              $map: {
                input: "$courseContent",
                as: "content",
                in: {
                  $size: "$$content.subtopics",
                },
              },
            },
          },
          userEnrolled: {
            $size: "$enrollments",
          },
          maxEnrolments: 1,
          instructorName: {
            $map: {
              input: "$instructor",
              as: "inst",
              in: {
                $concat: ["$$inst.first_name", " ", "$$inst.last_name"],
              },
            },
          },
          isPaid: {
            $in: [new ObjectId(userId), "$enrollments.userId"],
          },
        },
      },
      {
        $sort: {
          courseStartTime: -1,
          _id: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ];

    let course;
    let count;
    if (
      user?.referredBy?._id &&
      user?.referredBy?.role?.toString() === "65dc6817586cba2182f05561"
    ) {
      pipeline[0]["$match"]["courseInstructors.id"] = new ObjectId(
        user?.referredBy
      );
      course = await Course.aggregate(pipeline);

      count = await Course.countDocuments({
        status: "Published",
        type: "Course",
        "courseInstructors.id": new ObjectId(user?.referredBy),
      });
    } else {
      count = await Course.countDocuments({
        status: "Published",
        type: "Course",
      });

      course = await Course.aggregate(pipeline);
    }

    const newCourse = course
      .filter((elem) => elem?.type === "Course")
      .filter((elem, index) => {
        // console.log('name', elem?.courseName, index);
        if (
          elem?.courseType === "Live" &&
          elem?.registrationStartTime &&
          elem?.courseEndTime
        ) {
          // console.log('name', elem?.courseName, index);
          return (
            elem?.registrationStartTime &&
            new Date(elem?.registrationStartTime) <= new Date() &&
            ((elem?.courseEndTime &&
              elem?.isPaid &&
              new Date(elem?.courseEndTime) >= new Date()) ||
              (elem?.registrationEndTime &&
                new Date(elem?.registrationEndTime) >= new Date()))
          );
        } else {
          return elem;
        }
      });

    res.status(200).json({
      status: "success",
      // data: course.filter((elem)=> elem?.type==='Course'),
      data: newCourse,
      workshop: course.filter(
        (elem) =>
          elem?.type === "Workshop" &&
          elem?.registrationStartTime &&
          elem?.registrationStartTime <= new Date() &&
          ((elem?.courseEndTime &&
            elem?.isPaid &&
            elem?.courseEndTime >= new Date()) ||
            (elem?.registrationEndTime &&
              elem?.registrationEndTime >= new Date()))
      ),
      count: count,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "something went wrong" });
  }
};

exports.getCourseByIdUser = async (req, res) => {
  try {
    const courseId = req.params.id;
    const courses = await Course.findOne({ _id: new ObjectId(courseId) })
      .populate("courseInstructors.id", "first_name last_name email")
      .select("-purchaseIntent -createdOn -createdBy -commissionPercentage");

    const newObj = JSON.parse(JSON.stringify(courses));

    newObj.userEnrolled = courses?.enrollments?.length;
    delete newObj.enrollments;

    res.status(200).json({ status: "success", data: newObj });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getCourseBySlugUser = async (req, res) => {
  try {
    const slug = req.query.slug;
    const userId = req?.user?._id;
    const courses = await Course.findOne({
      courseSlug: slug,
      "enrollments.userId": new ObjectId(userId),
    })
      .populate("courseInstructors.id", "first_name last_name email")
      .select("-purchaseIntent -createdOn -createdBy -commissionPercentage");

    if (!courses) {
      const newCourse = await Course.findOne({ courseSlug: slug }).select(
        "-enrollments -createdOn -createdBy -commissionPercentage -courseContent"
      );
      console.log(newCourse, slug);
      return res.status(200).json({
        status: "success",
        message: `${
          newCourse?.type === "Workshop"
            ? `You haven't enrolled in this workshop.`
            : `You haven't enrolled in this course yet. Please purchase it to get started.`
        }`,
        hasPurchased: false,
        data: newCourse,
      });
    }

    const newObj = JSON.parse(JSON.stringify(courses));

    newObj.userEnrolled = courses?.enrollments?.length;
    delete newObj.enrollments;

    res
      .status(200)
      .json({ status: "success", data: newObj, hasPurchased: true });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getCoursesByUserSlug = async (req, res) => {
  try {
    const slug = req.query.slug;
    const user = await User.findOne({ slug: slug }).select(
      "_id first_name last_name influencerDetails profilePhoto"
    );
    const skip = Number(Number(req.query.skip) || 0);
    const limit = Number(Number(req.query.limit) || 10);

    const pipeline = [
      {
        $match: {
          status: "Published",
          "courseInstructors.id": new ObjectId(user?._id),
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "courseInstructors.id",
          foreignField: "_id",
          as: "instructor",
        },
      },
      {
        $sort: {
          _id: -1,
          _id: -1,
        },
      },
      {
        $addFields: {
          averageRating: { $ifNull: [{ $avg: "$ratings.rating" }, 0] }, // Calculate the average rating or set it to 0 if null
        },
      },
      {
        $project: {
          courseName: 1,
          _id: -1,
          courseOverview: 1,
          courseSlug: 1,
          type: 1,
          courseImage: 1,
          coursePrice: 1,
          registrationStartTime: 1,
          registrationEndTime: 1,
          courseStartTime: 1,
          courseEndTime: 1,
          courseType: 1,
          averageRating: 1,
          discountedPrice: 1,
          courseDurationInMinutes: 1,
          level: 1,
          courseContent: 1,
          userEnrolled: {
            $size: "$enrollments",
          },
          maxEnrolments: 1,
          instructorName: {
            $map: {
              input: "$instructor",
              as: "inst",
              in: {
                $concat: ["$$inst.first_name", " ", "$$inst.last_name"],
              },
            },
          },
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ];

    const course = await Course.aggregate(pipeline);

    for (let elem of course) {
      for (const subelem of elem?.courseContent) {
        for (const topics of subelem?.subtopics) {
          delete topics.videoUrl;
          delete topics.videoKey;
          delete topics.notes;
        }
      }
    }

    const count = await Course.countDocuments({
      status: "Published",
      type: "Course",
      "courseInstructors.id": new ObjectId(user?._id),
    });

    const newCourse = course
      .filter((elem) => elem?.type === "Course")
      .filter((elem, index) => {
        // console.log('name', elem?.courseName, index);
        if (
          elem?.courseType === "Live" &&
          elem?.registrationStartTime &&
          elem?.courseEndTime
        ) {
          // console.log('name', elem?.courseName, index);
          return (
            elem?.registrationStartTime &&
            new Date(elem?.registrationStartTime) <= new Date() &&
            ((elem?.courseEndTime &&
              new Date(elem?.courseEndTime) >= new Date()) ||
              (elem?.registrationEndTime &&
                new Date(elem?.registrationEndTime) >= new Date()))
          );
        } else {
          return elem;
        }
      });

    res.status(200).json({
      status: "success",
      data: newCourse,
      // data: course.filter((elem)=>elem?.type==='Course') ,
      workshop: course.filter(
        (elem) =>
          elem?.type === "Workshop" &&
          elem?.registrationStartTime &&
          elem?.registrationStartTime <= new Date() &&
          ((elem?.courseEndTime && elem?.courseEndTime >= new Date()) ||
            (elem?.registrationEndTime &&
              elem?.registrationEndTime >= new Date()))
      ),
      count: count,
      instructor: {
        first_name: user?.first_name,
        last_name: user?.last_name,
        influencerDetails: user?.influencerDetails,
        profilePhoto: user?.profilePhoto,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "something went wrong" });
  }
};

exports.getCourseBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const courses = await Course.findOne({ courseSlug: slug })
      .populate("courseInstructors.id", "first_name last_name email")
      .select("-enrollments -createdOn -createdBy");

    const newCourse = JSON.parse(JSON.stringify(courses));
    for (const subelem of newCourse?.courseContent) {
      for (const topics of subelem?.subtopics) {
        delete topics.videoUrl;
        delete topics.videoKey;
        delete topics.notes;
      }
    }

    let obj = {};
    for (let elem of newCourse?.courseInstructors) {
      const user = await User.findOne({ _id: elem?.id }).select(
        "_id first_name last_name influencerDetails profilePhoto"
      );

      obj = {
        first_name: user?.first_name,
        last_name: user?.last_name,
        influencerDetails: user?.influencerDetails,
        profilePhoto: user?.profilePhoto,
      };
    }
    res
      .status(200)
      .json({ status: "success", data: newCourse, instructor: obj });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.deductCourseFee = async (req, res, next) => {
  try {
    const { courseFee, courseName, courseId, coupon, bonusRedemption } =
      req.body;
    const userId = req.user._id;
    const result = await exports.handleDeductCourseFee(
      userId,
      courseFee,
      courseName,
      courseId,
      coupon,
      bonusRedemption,
      req
    );

    res.status(result.statusCode).json(result.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong...",
    });
  }
};

exports.handleDeductCourseFee = async (
  userId,
  courseFee,
  courseName,
  courseId,
  coupon,
  bonusRedemption,
  req
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    let affiliate, affiliateProgram;
    const course = await Course.findOne({ _id: new ObjectId(courseId) });
    const wallet = await UserWallet.findOne({ userId: userId });
    const user = await User.findOne({ _id: userId });
    const setting = await Setting.find({});
    let discountAmount = 0;
    let cashbackAmount = 0;
    const cashTransactions = wallet?.transactions?.filter((transaction) => {
      return transaction.transactionType === "Cash";
    });
    const bonusTransactions = wallet?.transactions?.filter((transaction) => {
      return transaction.transactionType === "Bonus";
    });

    const totalCashAmount = cashTransactions?.reduce((total, transaction) => {
      return total + transaction?.amount;
    }, 0);
    const totalBonusAmount = bonusTransactions?.reduce((total, transaction) => {
      return total + transaction?.amount;
    }, 0);

    //check course is lived

    if (course?.type === "Workshop") {
      if (course?.registrationStartTime > new Date()) {
        return {
          statusCode: 400,
          data: {
            status: "error",
            message:
              "Registration for this workshop has not yet begun. Please try again once registration begins.",
          },
        };
      }
      if (course?.registrationEndTime < new Date()) {
        return {
          statusCode: 400,
          data: {
            status: "error",
            message:
              "Registration for this workshop has ended. Please check this space regularly for upcoming workshops.",
          },
        };
      }
    }

    if (course?.status !== "Published") {
      return {
        statusCode: 400,
        data: {
          status: "error",
          message: `This ${
            course?.type === "Workshop" ? "workshop" : "course"
          } is not valid. Please join another one.`,
        },
      };
    }

    if (
      course?.courseStartTime &&
      course?.courseEndTime &&
      course?.courseEndTime <= new Date()
    ) {
      return {
        statusCode: 400,
        data: {
          status: "error",
          message: `This ${
            course?.type === "Workshop" ? "workshop" : "course"
          } has ended. Please join another one.`,
        },
      };
    }

    //Check if Bonus Redemption is valid
    // console.log(bonusRedemption , totalBonusAmount , bonusRedemption , course?.discountedPrice , setting[0]?.maxBonusRedemptionPercentage, (bonusRedemption > totalBonusAmount) , (bonusRedemption > (course?.discountedPrice * setting[0]?.maxBonusRedemptionPercentage)))
    if (
      bonusRedemption > totalBonusAmount ||
      bonusRedemption >
        course?.discountedPrice * setting[0]?.maxBonusRedemptionPercentage
    ) {
      return {
        statusCode: 400,
        data: {
          status: "error",
          message: "Incorrect HeroCash Redemption",
        },
      };
    }

    if (Number(bonusRedemption)) {
      wallet?.transactions?.push({
        title: "StoxHero HeroCash Redeemed",
        description: `${bonusRedemption} HeroCash used.`,
        transactionDate: new Date(),
        amount: -bonusRedemption?.toFixed(2),
        transactionId: uuid.v4(),
        transactionType: "Bonus",
      });
    }

    if (coupon) {
      let couponDoc = await Coupon.findOne({ code: coupon });
      if (!couponDoc) {
        let match = false;
        const affiliatePrograms = await AffiliateProgram.find({
          status: "Active",
        });
        if (affiliatePrograms.length != 0) {
          for (let program of affiliatePrograms) {
            match = program?.affiliates?.find(
              (item) =>
                item?.affiliateCode?.toString() == coupon?.toString() &&
                item?.affiliateStatus == "Active"
            );
            if (match) {
              affiliate = match;
              affiliateProgram = program;
              couponDoc = {
                rewardType: "Discount",
                discountType: "Percentage",
                discount: program?.discountPercentage,
                maxDiscount: program?.maxDiscount,
              };
              break;
            }
          }
        }

        if (!match) {
          const userCoupon = await User.findOne({
            myReferralCode: coupon?.toString(),
          });
          const referralProgram = await ReferralProgram.findOne({
            status: "Active",
          });

          // console.log("referralProgram", referralProgram, userCoupon)
          if (userCoupon) {
            affiliate = { userId: userCoupon?._id };
            affiliateProgram = referralProgram?.affiliateDetails;
            couponDoc = {
              rewardType: "Discount",
              discountType: "Percentage",
              discount: referralProgram?.affiliateDetails?.discountPercentage,
              maxDiscount: referralProgram?.affiliateDetails?.maxDiscount,
            };
          }
        }
      }
      if (couponDoc?.rewardType == "Discount") {
        if (couponDoc?.discountType == "Flat") {
          //Calculate amount and match
          discountAmount = couponDoc?.discount;
        } else {
          discountAmount = Math.min(
            (couponDoc?.discount / 100) * course?.discountedPrice,
            couponDoc?.maxDiscount
          );
        }
      } else {
        if (couponDoc?.discountType == "Flat") {
          //Calculate amount and match
          cashbackAmount = couponDoc?.discount;
        } else {
          cashbackAmount = Math.min(
            (couponDoc?.discount / 100) *
              (course?.discountedPrice - bonusRedemption),
            couponDoc?.maxDiscount
          );
        }
        wallet?.transactions?.push({
          title: "StoxHero CashBack",
          description: `Cashback of ${cashbackAmount?.toFixed(
            2
          )} HeroCash - code ${coupon} used`,
          transactionDate: new Date(),
          amount: cashbackAmount?.toFixed(2),
          transactionId: uuid.v4(),
          transactionType: "Bonus",
        });
      }
    }

    const totalAmount =
      (course?.discountedPrice - discountAmount - bonusRedemption) *
      (1 + setting[0]?.courseGstPercentage / 100); //todo-vijay

    // console.log(Number(totalAmount)?.toFixed(2) , Number(courseFee)?.toFixed(2), totalAmount, course?.discountedPrice , discountAmount , bonusRedemption , (1 + setting[0]?.courseGstPercentage / 100))
    if (Number(totalAmount)?.toFixed(2) != Number(courseFee)?.toFixed(2)) {
      return {
        statusCode: 400,
        data: {
          status: "error",
          message: `Incorrect ${
            course?.type === "Workshop" ? "workshop" : "course"
          } fee amount`,
        },
      };
    }
    if (totalCashAmount < Number(courseFee)) {
      return {
        statusCode: 400,
        data: {
          status: "error",
          message: `You do not have enough balance to enroll in this ${
            course?.type === "Workshop" ? "workshop" : "course"
          }. Please add money to your StoxHero Wallet.`,
        },
      };
    }

    for (let i = 0; i < course.enrollments?.length; i++) {
      if (course.enrollments[i]?.userId?.toString() === userId?.toString()) {
        return {
          statusCode: 400,
          data: {
            status: "error",
            message: `It looks like you've already enrolled. Please go to your account and view the more details under the "Courses --> My Library" tab`,
          },
        };
      }
    }

    if (
      course?.maxEnrolments &&
      course?.maxEnrolments <= course?.enrollments?.length
    ) {
      return {
        statusCode: 400,
        data: {
          status: "error",
          message: `The ${
            course?.type === "Workshop" ? "workshop" : "course"
          } is already full. We sincerely appreciate your enthusiasm to enrollment in our ${
            course?.type === "Workshop" ? "workshops" : "courses"
          }. Please enroll in other courses or workshops.`,
        },
      };
    }

    const totalAmountWithoutGST =
      course?.discountedPrice -
      (Number(discountAmount) || 0) -
      (Number(bonusRedemption) || 0);

    let obj = {
      userId: userId,
      actualFee: course?.coursePrice,
      discountedFee: course?.discountedPrice,
      discountUsed: discountAmount,
      pricePaidByUser: courseFee,
      gstAmount:
        (totalAmountWithoutGST * setting[0]?.courseGstPercentage) / 100,
      enrolledOn: new Date(),
    };
    if (Number(bonusRedemption)) {
      obj.bonusRedemption = bonusRedemption;
    }

    const updateParticipants = await Course.findOneAndUpdate(
      { _id: new ObjectId(courseId) },
      {
        $push: {
          enrollments: obj,
        },
      },
      { new: true, session: session }
    );

    const userWalletId = uuid.v4();
    wallet.transactions = [
      ...wallet.transactions,
      {
        title: `${course?.type === "Workshop" ? "Workshop" : "Course"} Fee`,
        description: `Amount deducted for the ${
          course?.type === "Workshop" ? "workshop" : "course"
        } fee of ${courseName}`,
        transactionDate: new Date(),
        amount: -courseFee,
        transactionId: userWalletId,
        transactionType: "Cash",
      },
    ];
    await wallet.save({ session });

    if (!updateParticipants || !wallet) {
      return {
        statusCode: 404,
        data: {
          status: "error",
          message: "Not found",
        },
      };
    }

    let recipients = [user.email, "team@stoxhero.com"];
    let recipientString = recipients.join(",");
    let subject = `${
      course?.type === "Workshop" ? "Workshop" : "Course"
    } Fee - StoxHero`;
    let message = `
        <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${
                  course?.type === "Workshop" ? "Workshop" : "Course"
                } Fee Deducted</title>
                <style>
                body {
                    font-family: Arial, sans-serif;
                    font-size: 16px;
                    line-height: 1.5;
                    margin: 0;
                    padding: 0;
                }

                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ccc;
                }

                h1 {
                    font-size: 24px;
                    margin-bottom: 20px;
                }

                p {
                    margin: 0 0 20px;
                }

                .userid {
                    display: inline-block;
                    background-color: #f5f5f5;
                    padding: 10px;
                    font-size: 15px;
                    font-weight: bold;
                    border-radius: 5px;
                    margin-right: 10px;
                }

                .password {
                    display: inline-block;
                    background-color: #f5f5f5;
                    padding: 10px;
                    font-size: 15px;
                    font-weight: bold;
                    border-radius: 5px;
                    margin-right: 10px;
                }

                .login-button {
                    display: inline-block;
                    background-color: #007bff;
                    color: #fff;
                    padding: 10px 20px;
                    font-size: 18px;
                    font-weight: bold;
                    text-decoration: none;
                    border-radius: 5px;
                }

                .login-button:hover {
                    background-color: #0069d9;
                }
                </style>
            </head>
            <body>
                <div class="container">
                <h1>${
                  course?.type === "Workshop" ? "Workshop" : "Course"
                } Fee</h1>
                <p>Hello ${user.first_name},</p>
                <p>Congratulations on enrolling in the ${
                  course?.type === "Workshop" ? "workshop" : "course"
                }! Here are your transaction details.</p>
                <p>User ID: <span class="userid">${user.employeeid}</span></p>
                <p>Full Name: <span class="password">${user.first_name} ${
      user.last_name
    }</span></p>
                <p>Email: <span class="password">${user.email}</span></p>
                <p>Mobile: <span class="password">${user.mobile}</span></p>
                <p>${
                  course?.type === "Workshop" ? "Workshop" : "Course"
                } Name: <span class="password">${course.courseName}</span></p>
                <p>${
                  course?.type === "Workshop" ? "Workshop" : "Course"
                } Fee: <span class="password">₹${courseFee}/-</span></p>

                ${
                  course?.courseType === "Live" &&
                  `<p>Start Date: <span class="password">${moment(
                    course?.courseStartTime
                  ).format("DD MMM hh:mm:ss a")}</span></p>
                <p>End Date: <span class="password">${moment(
                  course?.courseEndTime
                ).format("DD MMM hh:mm:ss a")}</span></p>`
                }
                </div>
            </body>
            </html>

        `;
    if (process.env.PROD === "true") {
      emailService(recipientString, subject, message);
      // console.log("Subscription Email Sent")
    }
    if (coupon && cashbackAmount > 0) {
      await createUserNotification(
        {
          title: "StoxHero Cashback",
          description: `${cashbackAmount?.toFixed(
            2
          )} HeroCash added as bonus - ${coupon} code used.`,
          notificationType: "Individual",
          notificationCategory: "Informational",
          productCategory: "Course",
          user: user?._id,
          priority: "Medium",
          channels: ["App", "Email"],
          createdBy: "63ecbc570302e7cf0153370c",
          lastModifiedBy: "63ecbc570302e7cf0153370c",
        },
        session
      );
      if (user?.fcmTokens?.length > 0) {
        await sendMultiNotifications(
          "StoxHero Cashback",
          `${cashbackAmount?.toFixed(
            2
          )}HeroCash credited as bonus in your wallet.`,
          user?.fcmTokens?.map((item) => item.token),
          null,
          { route: "wallet" }
        );
      }
    }
    await createUserNotification(
      {
        title: `${
          course?.type === "Workshop" ? "Workshop" : "Course"
        } Fee Deducted`,
        description: `₹${courseFee} deducted as ${
          course?.type === "Workshop" ? "Workshop" : "Course"
        } fee for ${course?.courseName}`,
        notificationType: "Individual",
        notificationCategory: "Informational",
        productCategory: "Course",
        user: user?._id,
        priority: "Low",
        channels: ["App", "Email"],
        createdBy: "63ecbc570302e7cf0153370c",
        lastModifiedBy: "63ecbc570302e7cf0153370c",
      },
      session
    );
    if (user?.fcmTokens?.length > 0) {
      await sendMultiNotifications(
        `${course?.type === "Workshop" ? "Workshop" : "Course"} Fee Deducted`,
        `₹${courseFee.toFixed(2)} deducted as ${
          course?.type === "Workshop" ? "Workshop" : "Course"
        } fee for ${course?.courseName}`,
        user?.fcmTokens?.map((item) => item.token),
        null,
        { route: "wallet" }
      );
    }
    if (coupon) {
      const product = await Product.findOne({ productName: "Course" }).select(
        "_id"
      );
      if (affiliate) {
        await creditAffiliateAmount(
          affiliate,
          affiliateProgram,
          product?._id,
          course?._id,
          course?.discountedPrice,
          userId
        );
      } else {
        await saveSuccessfulCouponUse(
          userId,
          coupon,
          product?._id,
          course?._id
        );
      }
    }

    const pricePaidByUser = courseFee;
    const gst = (totalAmountWithoutGST * setting[0]?.courseGstPercentage) / 100;
    const commissionPercentage = course?.commissionPercentage;
    const totalInfluencer = course?.courseInstructors?.length;
    const finalAmount =
      ((pricePaidByUser - gst) * commissionPercentage) / 100 / totalInfluencer;

    for (const elem of course?.courseInstructors) {
      const walletTransactionId = uuid.v4();

      const wallet = await UserWallet.findOneAndUpdate(
        { userId: new ObjectId(elem?.id) },
        {
          $push: {
            transactions: {
              title: `${
                course?.type === "Workshop" ? "Workshop" : "Course"
              } Commission Credited`,
              description: `Commission credited for the ${
                course?.type === "Workshop" ? "workshop" : "course"
              } purchase of ${courseName}`,
              transactionDate: new Date(),
              amount: finalAmount,
              transactionId: walletTransactionId,
              transactionType: "Cash",
            },
          },
        },
        { session: session }
      );

      await createUserNotification(
        {
          title: `${
            course?.type === "Workshop" ? "Workshop" : "Course"
          } Amount Credited`,
          description: `₹${finalAmount} credited as ${
            course?.type === "Workshop" ? "Workshop" : "Course"
          } purchase of ${course?.courseName}`,
          notificationType: "Individual",
          notificationCategory: "Informational",
          productCategory: "Course",
          user: elem?.id,
          priority: "Low",
          channels: ["App", "Email"],
          createdBy: "63ecbc570302e7cf0153370c",
          lastModifiedBy: "63ecbc570302e7cf0153370c",
        },
        session
      );

      await InfluencerTransaction.create(
        [
          {
            influencerWalletTId: walletTransactionId,
            buyerWalletTId: userWalletId,
            product: new ObjectId("65f053dc1e78925c8675ed81"),
            specificProduct: new ObjectId(course?._id),
            productActualPrice: course?.coursePrice,
            productDiscountedPrice: course?.discountedPrice,
            pricePaidByUser: pricePaidByUser,
            buyer: new ObjectId(userId),
            influencer: new ObjectId(elem?.id),
            lastModifiedBy: new ObjectId(userId),
            influencerPayout: finalAmount,
            transactionDate: new Date(),
          },
        ],
        { session: session }
      );
    }

    const userUpdate = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      {
        $push: {
          course: {
            courseId: course?._id,
            pricePaid: pricePaidByUser,
            gst: gst,
            coursePrice: course?.discountedPrice,
            discountUsed: Number(discountAmount) || 0,
            enrolledOn: new Date(),
            bonusRedemption: Number(bonusRedemption) || 0,
          },
        },
      },
      { session: session }
    );

    await session.commitTransaction();

    return {
      statusCode: 200,
      data: {
        status: "success",
        message: `Congratulations on successfully enrolling in the ${
          course?.type === "Workshop" ? "workshop" : "course"
        }! It will be a valuable experience for you.`,
        data: updateParticipants,
      },
    };
  } catch (e) {
    console.log(e);
    await session.abortTransaction();
    return {
      statusCode: 500,
      data: {
        status: "error",
        message: "Something went wrong",
        error: e.message,
      },
    };
  } finally {
    session.endSession();
  }
};

exports.enrollUser = async (req, res, next) => {
  const courseId = req.params.id;
  const userId = req.user._id;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const course = await Course.findOne({ _id: new ObjectId(courseId) });
    const user = await User.findOne({ _id: userId });

    if (course?.type === "Workshop") {
      if (new Date(course?.registrationStartTime) > new Date()) {
        return res.status(400).json({
          status: "error",
          message:
            "Registration for this workshop has not yet begun. Please try again once registration begins.",
        });
      }
      if (new Date(course?.registrationEndTime) < new Date()) {
        return res.status(400).json({
          status: "error",
          message:
            "Registration for this workshop has ended. Please check this space regularly for upcoming workshops.",
        });
      }
    }

    if (course?.status !== "Published") {
      return res.status(400).json({
        status: "error",
        message: `This ${
          course?.type === "Workshop" ? "workshop" : "course"
        } is not valid. Please join another one.`,
      });
    }

    if (
      course?.courseStartTime &&
      course?.courseEndTime &&
      course?.courseEndTime <= new Date()
    ) {
      return res.status(400).json({
        status: "error",
        message: `This ${
          course?.type === "Workshop" ? "workshop" : "course"
        } has ended. Please join another one.`,
      });
    }

    for (let i = 0; i < course.enrollments?.length; i++) {
      if (course.enrollments[i]?.userId?.toString() === userId?.toString()) {
        return res.status(400).json({
          status: "error",
          message: `It looks like you've already enrolled. Please go to your account and view the more details under the "Courses --> My Library" tab`,
        });
      }
    }

    if (
      course?.maxEnrolments &&
      course?.maxEnrolments <= course?.enrollments?.length
    ) {
      return res.status(400).json({
        status: "error",
        message: `The ${
          course?.type === "Workshop" ? "workshop" : "course"
        } is already full. We sincerely appreciate your enthusiasm to enrollment in our ${
          course?.type === "Workshop" ? "workshops" : "courses"
        }. Please enroll in other courses or workshops.`,
      });
    }

    let obj = {
      userId: userId,
      actualFee: course?.coursePrice,
      discountedFee: course?.discountedPrice,
      discountUsed: 0,
      pricePaidByUser: 0,
      gstAmount: 0,
      enrolledOn: new Date(),
    };

    const updateParticipants = await Course.findOneAndUpdate(
      { _id: new ObjectId(courseId) },
      {
        $push: {
          enrollments: obj,
        },
      },
      { new: true, session: session }
    );

    let recipients = [user.email, "team@stoxhero.com"];
    let recipientString = recipients.join(",");
    let subject = `${
      course?.type === "Workshop" ? "Workshop" : "Course"
    } Fee - StoxHero`;
    let message = `
        <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${
                  course?.type === "Workshop" ? "Workshop" : "Course"
                } Fee Deducted</title>
                <style>
                body {
                    font-family: Arial, sans-serif;
                    font-size: 16px;
                    line-height: 1.5;
                    margin: 0;
                    padding: 0;
                }

                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ccc;
                }

                h1 {
                    font-size: 24px;
                    margin-bottom: 20px;
                }

                p {
                    margin: 0 0 20px;
                }

                .userid {
                    display: inline-block;
                    background-color: #f5f5f5;
                    padding: 10px;
                    font-size: 15px;
                    font-weight: bold;
                    border-radius: 5px;
                    margin-right: 10px;
                }

                .password {
                    display: inline-block;
                    background-color: #f5f5f5;
                    padding: 10px;
                    font-size: 15px;
                    font-weight: bold;
                    border-radius: 5px;
                    margin-right: 10px;
                }

                .login-button {
                    display: inline-block;
                    background-color: #007bff;
                    color: #fff;
                    padding: 10px 20px;
                    font-size: 18px;
                    font-weight: bold;
                    text-decoration: none;
                    border-radius: 5px;
                }

                .login-button:hover {
                    background-color: #0069d9;
                }
                </style>
            </head>
            <body>
                <div class="container">
                <h1>Course Fee</h1>
                <p>Hello ${user.first_name},</p>
                <p>Congratulations on enrolling in the ${
                  course?.type === "Workshop" ? "workshop" : "course"
                }! Here are your transaction details.</p>
                <p>User ID: <span class="userid">${user.employeeid}</span></p>
                <p>Full Name: <span class="password">${user.first_name} ${
      user.last_name
    }</span></p>
                <p>Email: <span class="password">${user.email}</span></p>
                <p>Mobile: <span class="password">${user.mobile}</span></p>
                <p>${
                  course?.type === "Workshop" ? "Workshop" : "Course"
                } Name: <span class="password">${course.courseName}</span></p>
                

                ${
                  course?.courseType === "Live" &&
                  `<p>Start Date: <span class="password">${moment(
                    course?.courseStartTime
                  ).format("DD MMM hh:mm:ss a")}</span></p>
                <p>End Date: <span class="password">${moment(
                  course?.courseEndTime
                ).format("DD MMM hh:mm:ss a")}</span></p>`
                }
                </div>
            </body>
            </html>

        `;
    if (process.env.PROD === "true") {
      emailService(recipientString, subject, message);
      // console.log("Subscription Email Sent")
    }

    const userUpdate = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      {
        $push: {
          course: {
            courseId: course?._id,
            pricePaid: 0,
            gst: 0,
            coursePrice: course?.discountedPrice,
            discountUsed: 0,
            enrolledOn: new Date(),
          },
        },
      },
      { session: session }
    );

    await session.commitTransaction();

    return res.status(200).json({
      status: "success",
      message: `Congratulations on successfully enrolling in the ${
        course?.type === "Workshop" ? "workshop" : "course"
      }! It will be a valuable experience for you.`,
      data: updateParticipants,
    });
  } catch (e) {
    console.log(e);
    await session.abortTransaction();
    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: e.message,
    });
  } finally {
    session.endSession();
  }
};

exports.checkPaidCourses = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;

    const course = await Course.findOne({
      _id: new ObjectId(courseId),
      "enrollments.userId": new ObjectId(userId),
    });

    res.status(200).json({
      status: "success",
      data: course ? true : false,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong...",
    });
  }
};

exports.purchaseIntent = async (req, res) => {
  try {
    const { id } = req.params; // ID of the contest
    const userId = req.user._id;

    const result = await Course.findByIdAndUpdate(
      id,
      { $push: { purchaseIntent: { userId: userId, date: new Date() } } },
      { new: true } // This option ensures the updated document is returned
    );

    if (!result) {
      return res
        .status(404)
        .json({ status: "error", message: "Something went wrong." });
    }

    res.status(200).json({
      status: "success",
      message: "Intent Saved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.recordedVideoWatchIntent = async (req, res) => {
  try {
    const { id } = req.params; // ID of the contest
    const userId = req.user._id;

    const result = await Course.findByIdAndUpdate(
      id,
      {
        $push: {
          recordedVideoWatchIntent: { userId: userId, date: new Date() },
        },
      },
      { new: true } // This option ensures the updated document is returned
    );

    if (!result) {
      return res
        .status(404)
        .json({ status: "error", message: "Something went wrong." });
    }

    res.status(200).json({
      status: "success",
      message: "Intent Saved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.myCourses = async (req, res) => {
  try {
    const userId = req.user._id;
    const skip = Number(Number(req.query.skip) || 0);
    const limit = Number(Number(req.query.limit) || 10);

    const count = await Course.countDocuments({
      status: "Published",
      type: "Course",
      "enrollments.userId": new ObjectId(userId),
    });

    const result = await Course.aggregate([
      {
        $match: {
          status: "Published",
          "enrollments.userId": new ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "user-personal-details",
          localField: "courseInstructors.id",
          foreignField: "_id",
          as: "instructor",
        },
      },
      {
        $addFields: {
          userEnrolled: {
            $size: { $ifNull: ["$enrollments", []] },
          },
        },
      },
      {
        $addFields: {
          averageRating: { $ifNull: [{ $avg: "$ratings.rating" }, 0] }, // Calculate the average rating or set it to 0 if null
        },
      },
      {
        $unwind: {
          path: "$enrollments",
        },
      },
      {
        $match: {
          "enrollments.userId": new ObjectId(userId),
        },
      },
      {
        $project: {
          courseName: 1,
          _id: -1,
          courseSlug: 1,
          meetLink: 1,
          courseOverview: 1,
          courseImage: 1,
          coursePrice: 1,
          discountedPrice: 1,
          registrationStartTime: 1,
          registrationEndTime: 1,
          courseStartTime: 1,
          courseEndTime: 1,
          courseType: 1,
          userEnrolled: 1,
          courseDurationInMinutes: 1,
          courseType: 1,
          type: 1,
          category: 1,
          level: 1,
          lectures: {
            $sum: {
              $map: {
                input: "$courseContent",
                as: "content",
                in: {
                  $size: "$$content.subtopics",
                },
              },
            },
          },
          maxEnrolments: 1,
          averageRating: 1,
          topics: "$courseContent",
          instructorImage: {
            $arrayElemAt: ["$courseInstructors.image", 0],
          },
          courseProgress: {
            $cond: {
              if: { $eq: [{ $size: { $ifNull: ["$courseContent", []] } }, 0] },
              then: 0, // or any other default value you prefer
              else: {
                $divide: [
                  { $size: { $ifNull: ["$enrollments.watched", []] } },
                  { $size: { $ifNull: ["$courseContent", []] } },
                ],
              },
            },
          },
          instructorName: {
            $map: {
              input: "$instructor",
              as: "inst",
              in: {
                $concat: ["$$inst.first_name", " ", "$$inst.last_name"],
              },
            },
          },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    const newCourse = result
      .filter((elem) => elem?.type === "Course")
      .filter((elem, index) => {
        // console.log('name', elem?.courseName, index);
        if (
          elem?.courseType === "Live" &&
          elem?.registrationStartTime &&
          elem?.courseEndTime
        ) {
          // console.log('name', elem?.courseName, index);
          return (
            elem?.registrationStartTime &&
            new Date(elem?.registrationStartTime) <= new Date() &&
            ((elem?.courseEndTime &&
              new Date(elem?.courseEndTime) >= new Date()) ||
              (elem?.registrationEndTime &&
                new Date(elem?.registrationEndTime) >= new Date()))
          );
        } else {
          return elem;
        }
      });

    res.status(200).json({
      status: "success",
      message: "Data Fetched successfully",
      workshop: result?.filter((elem) => elem?.type === "Workshop"),
      data: newCourse,
      count: count,
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

exports.getCourseRating = async (req, res) => {
  const courseId = req.params.id;
  let total = 0;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ status: "error", message: "Course not found" });
    }
    if (!course.ratings || course.ratings.length === 0) {
      // Dummy data
      const rating = 4.25;
      return res.status(200).json({ status: "success", data: rating });
    }
    for (let ratingObj of course.ratings) {
      total += ratingObj.rating;
    }
    const rating = total / course.ratings.length; // Fix typo here
    res.status(200).json({ status: "success", data: rating });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: e.message,
    });
  }
};

exports.addUserRating = async (req, res, next) => {
  const courseId = req.params.id;
  const userId = req.user._id;
  const { rating, review } = req.body;
  try {
    let course = await Course.findById(courseId).select("ratings enrollments");
    if (!course) {
      return res
        .status(404)
        .json({ status: "error", message: "Course not found" });
    }
    const userPurchased = course.enrollments?.findIndex(
      (obj) => obj?.userId?.toString() == userId?.toString()
    );
    if (userPurchased == -1) {
      //user hasn't enrolled
      res.status(400).json({
        status: "error",
        message: "You haven't enrolled for this course",
      });
    }
    const index = course.ratings.findIndex(
      (obj) => obj?.userId?.toString() === userId?.toString()
    );
    if (index === -1) {
      course.ratings.push({
        rating: rating,
        userId: userId,
        review: review,
        ratingDate: new Date(),
      });
    } else {
      course.ratings.splice(index, 1, {
        rating: rating,
        userId: userId,
        review: review,
        ratingDate: new Date(),
      });
    }
    await course.save();
    res.status(200).json({ status: "success", message: "Rating Added" });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
      error: e.message,
    });
  }
};

exports.handleS3Upload = async (req, res) => {
  console.log(
    req.body,
    req.files["fileVid"][0],
    req.files["fileVid"][0].mimetype
  );
  try {
    const url = await getAwsS3Key(
      req.files["fileVid"][0],
      "Video",
      `courses/video/${req.body?.courseId}-${req.body.contentId}-${Date.now()}`
    );
    console.log(url);
    res.status(200).json({
      message: "File uploaded successfully",
      fileUrl: url,
    });
  } catch (e) {
    console.log("error hai", e);
  }
};

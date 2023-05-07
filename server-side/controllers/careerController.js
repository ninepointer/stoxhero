const aws = require('aws-sdk');
const CareerApplication = require("../models/Careers/careerApplicationSchema");
const Career = require("../models/Careers/careerSchema");

const s3 = new aws.S3();

exports.getUploadsApplication = (async(req, res, next) => {

try {
  const { firstName, lastName, email, mobile, rollNo, dob, collageName, tradingExp, applyingFor, source } = req.body;
//   console.log(req.body)
  const uploadedFiles = req.files
  const fileUploadPromises = uploadedFiles.map(async (file) => {
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `career/resume/${file.originalname}`,
      Body: file.buffer,
    };
    const uploadedObject = await s3.upload(uploadParams).promise();
    return {
      name: file.originalname,
      url: uploadedObject.Location,
      size: (uploadedObject).Size,
      mimetype: file.mimetype,
    };
  });
  const uploadedData = await Promise.all(fileUploadPromises);
  const data = await CareerApplication.create({
    first_name: firstName,
    last_name: lastName,
    email: email,
    mobileNo: mobile,
    rollNo: rollNo,
    dob: dob,
    collegeName: collageName,
    tradingExp: tradingExp,
    applyingFor: applyingFor,
    source: source,
    resume: uploadedData[0].url,
});
console.log(data)
  res.status(201).json({message: "Details Submitted", data: uploadedData});
} catch (error) {
  console.error(error);
  res.status(500).send({status: "error", message: "Error uploading files."});
}

});

exports.createCareer = async(req, res, next)=>{
    console.log(req.body)
    const{
        jobTitle, jobDescription, rolesAndResponsibilities, jobType, jobLocation,
        status } = req.body;
    if(await Career.findOne({jobTitle, status: "Active" })) return res.status(400).json({message:'This job post already exists.'});

    const career = await Career.create({jobTitle, jobDescription, rolesAndResponsibilities, jobType, jobLocation,
        status, createdBy: req.user._id, lastModifiedBy: req.user._id});
    
    res.status(201).json({message: 'Career post successfully created.', data:career});
}







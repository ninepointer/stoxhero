const aws = require('aws-sdk');
const CareerApplication = require("../models/Careers/careerApplicationSchema");
const Career = require("../models/Careers/careerSchema");

const s3 = new aws.S3();

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el) && obj[el] !== null && obj[el] !== undefined && obj[el] !== '') {
        newObj[el] = obj[el];
      }
    });
    return newObj;
};

exports.getUploadsApplication = (async(req, res, next) => {

try {
  const { firstName, lastName, email, mobile, dob, collegeName, tradingExp, source, career } = req.body;
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
    dob: dob,
    collegeName: collegeName,
    tradingExp: tradingExp,
    source: source,
    resume: uploadedData[0].url,
    career: career
    });
    console.log(data)
    res.status(201).json({message: "Your job application has been submitted successfully!", data: uploadedData});
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

exports.editCareer = async(req, res, next) => {
    const id = req.params.id;

    console.log("id is ,", id)
    const tenx = await Career.findById(id);

    const filteredBody = filterObj(req.body, "jobTitle", "jobDescription", "jobType", "jobLocation", "status");
    if(req.body.rolesAndResponsibilities)filteredBody.rolesAndResponsibilities=[...tenx.rolesAndResponsibilities,
        {orderNo:req.body.rolesAndResponsibilities.orderNo,
            description:req.body.rolesAndResponsibilities.description,}]
    filteredBody.lastModifiedBy = req.user._id;    

    console.log(filteredBody)
    const updated = await Career.findByIdAndUpdate(id, filteredBody, { new: true });

    res.status(200).json({message: 'Successfully edited tenx.', data: updated});
}

exports.getCareers = async(req, res, next)=>{
    const career = await Career.find({status: "Live"}).select('jobTitle jobDescription rolesAndResponsibilities jobType jobLocation status')
    res.status(201).json({message: 'success', data:career});
}

exports.getCareer = async (req,res,next) => {
  console.log("inside getCareer")
  const {id} = req.params;
  try {
      const career = await Career.findOne({
        _id: id,
      })
      if (!career) {
        return res.status(200).json({ status: 'success', message: 'Career not found.', data: {} });
      }
        return res.status(200).json({ status: 'success', message: 'Successful', data: career });
    } catch (e) {
      console.log(e);
      res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
}
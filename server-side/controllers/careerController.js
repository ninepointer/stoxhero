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
  const { firstName, lastName, email, mobile, dob, collegeName, linkedInProfileLink, priorTradingExperience, source, career } = req.body;
  // console.log("Career Application: ",req.body)
  const data = await CareerApplication.create({
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    email: email.trim(),
    mobileNo: mobile.trim(),
    dob: dob,
    collegeName: collegeName,
    linkedInProfileLink: linkedInProfileLink,
    priorTradingExperience: priorTradingExperience,
    source: source,
    // resume: uploadedData[0].url,
    career: career
    });

    res.status(201).json({message: "Your job application has been submitted successfully!"});
    } catch (error) {
    console.error(error);
    res.status(500).send({status: "error", message: "Error uploading files."});
    }

});

exports.createCareer = async(req, res, next)=>{
    // console.log(req.body)
    const{
        jobTitle, jobDescription, rolesAndResponsibilities, jobType, jobLocation, campaign,
        status } = req.body;
    if(await Career.findOne({jobTitle, status: "Live" })) return res.status(400).json({info:'This job post is already live.'});

    const career = await Career.create({jobTitle:jobTitle.trim(), jobDescription, rolesAndResponsibilities, jobType, jobLocation, campaign,
        status, createdBy: req.user._id, lastModifiedBy: req.user._id});
    // console.log("Career: ",career)
    res.status(201).json({message: 'Career post successfully created.', data:career});
}

exports.editCareer = async(req, res, next) => {
    const id = req.params.id;

    // console.log("id is ,", id)
    const career = await Career.findById(id);

    const filteredBody = filterObj(req.body, "jobTitle", "jobDescription", "jobType", "jobLocation", "campaign", "status");
    if(req.body.rolesAndResponsibilities)filteredBody.rolesAndResponsibilities=[...career.rolesAndResponsibilities,
        {orderNo:req.body.rolesAndResponsibilities.orderNo,
            description:req.body.rolesAndResponsibilities.description,}]
    filteredBody.lastModifiedBy = req.user._id;    

    // console.log(filteredBody)
    const updated = await Career.findByIdAndUpdate(id, filteredBody, { new: true });

    res.status(200).json({message: 'Successfully edited tenx.', data: updated});
}

exports.getCareers = async(req, res, next)=>{
    const career = await Career.aggregate(
      [
        {
          $lookup: {
            from: "career-applications",
            localField: "_id",
            foreignField: "career",
            as: "applicants",
          },
        },
        {
          $match: {
            status: "Live",
          },
        },
        {
          $project: {
            jobTitle: 1,
            jobDescription: 1,
            jobType: 1,
            jobLocation: 1,
            status: 1,
            applicants: 1,
            rolesAndResponsibilities: 1,
            campaign: 1,
          },
        },
      ]
    )
    res.status(201).json({message: 'success', data:career});
}

exports.getCareer = async (req,res,next) => {
  // console.log("inside getCareer")
  const {id} = req.params;
  try {
      const career = await Career.findOne({_id: id})
      .populate('campaign', 'campaignName campaignCode')

      // console.log("Career: ",career)
      if (!career) {
        return res.status(200).json({ status: 'success', message: 'Career not found.', data: {} });
      }
        return res.status(200).json({ status: 'success', message: 'Successful', data: career });
    } catch (e) {
      console.log(e);
      res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
}

exports.getCareerApplicantions = async(req, res, next)=>{
  const {id} = req.params;
  const careerApplications = await CareerApplication.find({career: id}).select('first_name last_name mobileNo email collegeName linkedInProfileLink dob appliedOn priorTradingExperience source')
  res.status(201).json({message: 'success', data:careerApplications, count:careerApplications.length});
}
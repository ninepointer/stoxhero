const { ObjectId } = require('mongodb');
const AWS = require('aws-sdk');
const College = require('../../models/createCollege/createCollegeSchema');



AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION

});
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


exports.create = (async (req, res, next) => {
  
  try {
      const { name, slogan, route, event, address, status } = req.body;

      const image = req.file;
      const logo = image && await Promise.all(await processUpload([image], s3, route, true));
      const college = await College.create({
          logo: logo[0], name, slogan, route, event, address, status,
          createdBy: req.user._id, lastModifiedBy: req.user._id,
      });
     
      res.status(200).json({status: "success", data: college, message: "College created successfully."});
  } catch (error) {
      console.error(error);
      res.status(500).send({status: "error", err: error, message: "Error uploading files."});
  }
});

const processUpload = async(uploadedFiles, s3, route)=>{
  const MAX_LIMIT = 5*1024*1024;
  const fileUploadPromises = uploadedFiles.map(async (file) => {
      
      if(file.size > MAX_LIMIT){
          return res.status(500).send({status: "error", err: error, message: 'Image size should be less then 5 MB.'});
      }
      const key = `collegeLogo/${route}/photos/${(Date.now()) + file.originalname}`;
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

exports.edit = (async (req, res, next) => {

  try {
      const update = req.body;
      const {id} = req.params;
      const image = req.file;
      let logoImage;

      if(image){
          logoImage = await Promise.all(await processUpload([image], s3, update.route));
          update.logo = logoImage[0];
      }

      update.lastModifiedBy = req?.user?._id;
      update.lastModifiedOn = new Date();

      const collegeUpdate = await College.findOneAndUpdate({_id: new ObjectId(id)}, update, {new: true})

      res.status(200).json({status: "success", data: collegeUpdate, message: "College edited successfully"});
  } catch (error) {
      console.error(error);
      res.status(500).send({status: "error", err: error, message: "Error uploading files."});
  }
});

exports.getAllCollege = async (req, res, next) => {
  try {
      const skip = parseInt(req.query.skip) || 0;
      const limit = parseInt(req.query.limit) || 10
      const count = await College.countDocuments();

      const active = await College.find()
          .select('-createdBy -createdOn -lastModifiedOn -lastModifiedBy')
          .sort({ createdOn: -1 })
          .skip(skip)
          .limit(limit);

      res.status(200).json({
          status: 'success',
          data: active,
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

exports.getActive = async (req, res, next) => {
  try {
      const skip = parseInt(req.query.skip) || 0;
      const limit = parseInt(req.query.limit) || 10
      const count = await College.countDocuments({ status: "Active" });

      const active = await College.find({ status: "Active" })
          .select('-createdBy -createdOn -lastModifiedOn -lastModifiedBy')
          .sort({ createdOn: -1 })
          .skip(skip)
          .limit(limit);

      res.status(200).json({
          status: 'success',
          data: active,
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

exports.getInactive = async (req, res, next) => {
  try {
      const skip = parseInt(req.query.skip) || 0;
      const limit = parseInt(req.query.limit) || 10
      const count = await College.countDocuments({ status: "Inactive" });

      const Inactive = await College.find({ status: "Inactive" })
          .select('-createdBy -createdOn -lastModifiedOn -lastModifiedBy')
          .sort({ createdOn: -1 })
          .skip(skip)
          .limit(limit);

      res.status(200).json({
          status: 'success',
          data: Inactive,
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

exports.getDraft = async (req, res, next) => {
  try {
      const skip = parseInt(req.query.skip) || 0;
      const limit = parseInt(req.query.limit) || 10
      const count = await College.countDocuments({ status: "Draft" });

      const Draft = await College.find({ status: "Draft" })
          .select('-createdBy -createdOn -lastModifiedOn -lastModifiedBy')
          .sort({ createdOn: -1 })
          .skip(skip)
          .limit(limit);

      res.status(200).json({
          status: 'success',
          data: Draft,
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

exports.getById = async (req, res, next) => {
  try {
      const {id} = req.params;
      // const skip = parseInt(req.query.skip) || 0;
      // const limit = parseInt(req.query.limit) || 10
      const count = await College.countDocuments({ _id: new ObjectId(id) });

      const active = await College.find({ _id: new ObjectId(id) })
          .select('-createdBy -createdOn -lastModifiedOn -lastModifiedBy')
          // .sort({ createdOn: -1 })
          // .skip(skip)
          // .limit(limit);

      res.status(200).json({
          status: 'success',
          data: active,
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

exports.getByRoute = async (req, res, next) => {
  try {
      const {route} = req.params;
      // const skip = parseInt(req.query.skip) || 0;
      // const limit = parseInt(req.query.limit) || 10
      const count = await College.countDocuments({ route: route });

      const active = await College.findOne({ route: route })
          .select('-createdBy -createdOn -lastModifiedOn -lastModifiedBy')
          // .sort({ createdOn: -1 })
          // .skip(skip)
          // .limit(limit);

      res.status(200).json({
          status: 'success',
          data: active,
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
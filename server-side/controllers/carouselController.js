const UserRole = require("../models/User/everyoneRoleSchema");
const Carousel = require('../models/carousel/carouselSchema');
const { ObjectId } = require('mongodb');

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
  
const upload = multer({ storage, fileFilter }).single("carouselImage");
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

exports.uploadToS3 = async(req, res, next) => {
    if (!req.file) {
      // no file uploaded, skip to next middleware
      next();
      return;
    }
  
    // create S3 upload parameters
    let carouselName;
    if(req.body.carouselName){
        carouselName = req.body.carouselName;
    }else{
        let carousel = await Carousel.findById(req.params.id);
        carouselName = `${carousel?.carouselName}` ;
    }
    const key = `carousels/${carouselName}/photos/${(Date.now()) + req.file.originalname}`;
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
  

exports.createCarousel =async (req, res, next) => {
    // console.log(req.body)
    const{carouselName, description, clickable, visibility, window, carouselPosition, linkToCarousel, carouselStartDate, carouselEndDate, status} = req.body;
    const carouselImage = (req).uploadUrl;

    // console.log(req.body);
    //Check for required fields 
    if(!(carouselName))return res.status(400).json({status: 'error', message: 'Enter all mandatory fields.'})
    try{
      //Check if user exists
      // if(await carousel.findOne({isDeleted: false, email})) return res.json({})('User with this email already exists. Please login with existing email.', 401));
      const carousel = await Carousel.create({carouselName: carouselName.trim(), description, clickable, window, visibility, carouselPosition, linkToCarousel, carouselStartDate, carouselEndDate, status,
         createdBy: (req).user._id, carouselImage});
  
      if(!carousel) return res.status(400).json({status: 'error', message: 'Couldn\'t create carousel'});
  
      res.status(201).json({status: "success", data:carousel, message: "Carousel Created Successfully"});
    }catch(e){
      console.log(e);
      res.status(500).json({status:'error', message: 'Something went wrong.'});
    }
    
};

exports.getCarousels = async (req, res, next)=>{
  try{
    const carousels = await Carousel.find({isDeleted: false})
    .populate('objectId')
    .populate('clickedBy.userId', 'first_name last_name mobile email joining_date creationProcess')
    .sort({carouselEndDate:-1});
  
  
      if(!carousels) return res.json({status:'error', message:'No carousels found.'});
      
      res.status(200).json({status:"success", data: carousels, results: carousels.length});
  }catch(e){
      console.log(e);
      res.status(500).json({status:'error', message: 'Something went wrong.'});
  }  

};

exports.getDraftCarousels = async(req, res, next)=>{
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 8
  const count = await Carousel.countDocuments(
                      {
                        status: 'Draft'
                      })
  try{
      const liveCarousels = await Carousel.find(
                            {
                              status: 'Draft'
                            })
                            .populate('clickedBy.userId', 'first_name last_name mobile email joining_date creationProcess')
                            .skip(skip)
                            .limit(limit);
      res.status(201).json({status: 'success', data: liveCarousels, count: count});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }
};

exports.getPastCarousels = async(req, res, next)=>{
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 8
  const count = await Carousel.countDocuments(
                      {
                        carouselEndDate: {$lt: new Date()}
                      })
  try{
      const liveCarousels = await Carousel.find(
                            {
                              carouselEndDate: {$lt: new Date()}
                            })
                            .populate('clickedBy.userId', 'first_name last_name mobile email joining_date creationProcess')
                            .skip(skip)
                            .limit(limit);
      res.status(201).json({status: 'success', data: liveCarousels, count: count});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }
};

exports.getUpcomingCarousels = async(req, res, next)=>{
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 8
  const count = await Carousel.countDocuments(
                      {
                        $and: [
                          { carouselStartDate : {$gt : new Date()}},
                          { carouselEndDate : {$gt : new Date()}}
                        ],
                        status: 'Live'
                      })
  try{
      const liveCarousels = await Carousel.find(
                            {
                              $and: [
                                { carouselStartDate : {$gt : new Date()}},
                                { carouselEndDate : {$gt : new Date()}}
                              ],
                              status: 'Live'
                            })
                            .populate('clickedBy.userId', 'first_name last_name mobile email joining_date creationProcess')
                            .skip(skip)
                            .limit(limit);
      res.status(201).json({status: 'success', data: liveCarousels, count: count});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }
};

exports.getLiveCarousels = async(req, res, next)=>{
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 8
  const count = await Carousel.countDocuments(
                      {
                        $and: [
                          { carouselStartDate : {$lte : new Date()}},
                          { carouselEndDate : {$gte : new Date()}}
                        ],
                        status: 'Live'
                      })
  try{
      const liveCarousels = await Carousel.find(
                            {
                              $and: [
                                { carouselStartDate : {$lte : new Date()}},
                                { carouselEndDate : {$gte : new Date()}}
                              ],
                              status: 'Live'
                            })
                            .populate('clickedBy.userId', 'first_name last_name mobile email joining_date creationProcess')
                            .skip(skip)
                            .limit(limit);
      res.status(201).json({status: 'success', data: liveCarousels, count: count});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }
};

exports.getInfinityLiveCarousels = async(req, res, next)=>{
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 8
  const count = await Carousel.countDocuments(
                      {
                        $and: [
                          { carouselStartDate : {$lte : new Date()}},
                          { carouselEndDate : {$gte : new Date()}}
                        ],
                        status: 'Live',
                        $or: [
                          { visibility: 'Infinity' },
                          { visibility: 'All' }
                        ]
                      })

  try{

    const liveCarousels = await Carousel.find(
        {
          $and: [
            { carouselStartDate : {$lte : new Date()}},
            { carouselEndDate : {$gte : new Date()}}
          ],
          status: 'Live',
          $or: [
            { visibility: 'Infinity' },
            { visibility: 'All' }
          ]
        })
      .sort({carouselPosition:1})
      .populate('clickedBy.userId', 'first_name last_name mobile email joining_date creationProcess')
      .skip(skip)
      .limit(limit);
    
      res.status(201).json({status: 'success', data: liveCarousels, count: count});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }
};

exports.getStoxHeroLiveCarousels = async(req, res, next)=>{
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 8
  const count = await Carousel.countDocuments(
                      {
                        $and: [
                          { carouselStartDate : {$lte : new Date()}},
                          { carouselEndDate : {$gte : new Date()}}
                        ],
                        status: 'Live',
                        $or: [
                          { visibility: 'StoxHero' },
                          { visibility: 'All' }
                        ]
                      })

  try{

    const liveCarousels = await Carousel.find(
        {
          $and: [
            { carouselStartDate : {$lte : new Date()}},
            { carouselEndDate : {$gte : new Date()}}
          ],
          status: 'Live',
          $or: [
            { visibility: 'StoxHero' },
            { visibility: 'All' }
          ]
        })
      .sort({carouselPosition:1})
      .populate('clickedBy.userId', 'first_name last_name mobile email joining_date creationProcess')
      .skip(skip)
      .limit(limit);
    
      res.status(201).json({status: 'success', data: liveCarousels, count: count});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }
};

exports.getUpcomingInfinityCarousels = async(req, res, next)=>{
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 8
  const count = await Carousel.countDocuments(
                      {
                        $and: [
                          { carouselStartDate : {$gt : new Date()}},
                          { carouselEndDate : {$gt : new Date()}}
                        ],
                        status: 'Live',
                        $or: [
                          { visibility: 'Infinity' },
                          { visibility: 'All' }
                        ]
                      })

  try{

    const liveCarousels = await Carousel.find(
        {
          $and: [
            { carouselStartDate : {$gt : new Date()}},
            { carouselEndDate : {$gt : new Date()}}
          ],
          status: 'Live',
          $or: [
            { visibility: 'Infinity' },
            { visibility: 'All' }
          ]
        })
      .sort({carouselPosition:1})
      .populate('clickedBy.userId', 'first_name last_name mobile email joining_date creationProcess')
      .skip(skip)
      .limit(limit);
    
      res.status(201).json({status: 'success', data: liveCarousels, count: count});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }
};

exports.getUpcomingStoxHeroCarousels = async(req, res, next)=>{
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 8
  const count = await Carousel.countDocuments(
                      {
                        $and: [
                          { carouselStartDate : {$gt : new Date()}},
                          { carouselEndDate : {$gt : new Date()}}
                        ],
                        status: 'Live',
                        $or: [
                          { visibility: 'StoxHero' },
                          { visibility: 'All' }
                        ]
                      })

  try{

    const liveCarousels = await Carousel.find(
        {
          $and: [
            { carouselStartDate : {$gt : new Date()}},
            { carouselEndDate : {$gt : new Date()}}
          ],
          status: 'Live',
          $or: [
            { visibility: 'StoxHero' },
            { visibility: 'All' }
          ]
        })
      .sort({carouselPosition:1})
      .populate('clickedBy.userId', 'first_name last_name mobile email joining_date creationProcess')
      .skip(skip)
      .limit(limit);
    
      res.status(201).json({status: 'success', data: liveCarousels, count: count});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }
};

exports.getHomePageCarousels = async(req, res, next)=>{
  const userRoleId = req.user.role
  const userRoleName = await UserRole.findById(userRoleId);
  const roleFilter = userRoleName?.roleName === "User" ? "StoxHero" : userRoleName.roleName === 'Infinity Trader' ? "Infinity" : "All"
  const count = await Carousel.countDocuments({carouselEndDate: {$gte : new Date()}, carouselStartDate : {$lte : new Date()} , status: 'Live', visibility: roleFilter})
  let liveCarousels = [];
  try{
    if(userRoleName.roleName === "Admin"){
      liveCarousels = await Carousel.find(
        {
          $and: [
            { carouselStartDate : {$lte : new Date()}},
            { carouselEndDate : {$gte : new Date()}}
          ],
          status: 'Live'
        })
      .sort({carouselPosition:1})
    }
    else{
      liveCarousels = await Carousel.find(
        { 
          status: 'Live',
          $or: [
            { visibility: roleFilter },
            { visibility: 'All' }
          ],
          $and: [
            { carouselStartDate : {$lte : new Date()}},
            { carouselEndDate : {$gte : new Date()}}
          ]
        })
      .sort({carouselPosition:1})
    }
      res.status(201).json({status: 'success', data: liveCarousels, count: count});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }
};

exports.deleteCarousel = async (req, res, next) => {
    const {id} = req.params;

    const filter = { _id: id };
    const update = { isDeleted: true };

    try{
        const carousel = await Carousel.findByIdAndUpdate(id, update);
        res.status(200).json({message : "data delete succesfully"});
    } catch (e){
      console.log(e);
      res.status(500).json({status:'error', message: 'Something went wrong.'});
    }    
    
};

exports.getCarousel = async (req, res, next) => {
    const id = req.params.id;
    console.log("Carousel Id:",req.params.id)
    try{
      const carousel = await Carousel.findOne({_id: id, isDeleted: false}).select('-__v -password')
      // .populate('objectId')
      .populate('clickedBy.userId', 'first_name last_name joining_date creationProcess');
  
      if(!carousel) return res.status(404).json({status: 'error', message: 'No such carousel found.'});
      
      res.status(200).json({status:"success", data: carousel});
    }catch(e){
      console.log(e);
      res.status(500).json({status:'error', message: 'Something went wrong.'});
    }

};


exports.editCarousel = async (req, res, next) => {
    // console.log("Carousel Values:",req.body)
    const id = req.params.id;
    try{

      const carousel = await Carousel.findOne({_id: id});
  
      if(!carousel) return res.status(404).json({status: 'error', message: 'No such carousel found.'});
  
      const filteredBody = filterObj(req.body, 'carouselName', 'description', 'carouselEndDate', 
      'status', 'window', 'clickable', 'visibility' ,'carouselPosition', 'linkToCarousel', 'carouselStartDate','lastModifiedBy');
      
      filteredBody.lastModifiedBy = req.user.id;
      // console.log((req).uploadUrl);
      if ((req).file) filteredBody.carouselImage = (req).uploadUrl;
  
      
      const updatedCarousel = await Carousel.findByIdAndUpdate(id, filteredBody, {
          new: true,
          runValidators: true
        }).select('-__v');
      res.status(200).json({status: "success", data:updatedCarousel, message:"Carousel Updated"});
    }catch(e){
      console.log(e);
      res.status(500).json({status:'error', message: 'Something went wrong.'});
    }

};

exports.getActiveCarousels = async (req, res, next)=>{
  let date = new Date();
  const carousels = await Carousel.find({isDeleted: false, carouselStartDate : {$gte : date}, endDate :{$lte : date}})
  .populate('objectId')
  .populate('clickedBy.userId', 'first_name last_name mobile email joining_date creationProcess')
  .sort({endDate:-1});

  if(!carousels) return res.status(404).json({status: 'error' ,message:'No carousels found.'});
  
  res.status(200).json({status:"success", data: carousels, results: carousels.length});

};

exports.saveCarouselClick = async (req, res) => {
  try {
      const { id } = req.params; // ID of the Carousel 
      console.log(id);
      const userId = req.user._id;
      const result = await Carousel.findByIdAndUpdate(
          ObjectId(id),
          { $push: { clickedBy: { userId: userId, clickedOn: new Date() } } },
          { new: true }  // This option ensures the updated document is returned
      );

      if (!result) {
          return res.status(404).json({ status: "error", message: "Something went wrong." });
      }

      res.status(200).json({
          status: "success",
          message: "Carousel Click Saved successfully",
          data: result
      });
  } catch (error) {
      res.status(500).json({
          status: "error",
          message: "Something went wrong",
          error: error.message
      });
  }
};

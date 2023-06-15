const TenXSubscription = require("../models/TenXSubscription/TenXSubscriptionSchema");
const TenXPurchaseIntent = require("../models/TenXSubscription/TenXPurchaseIntentSchema");


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el) && obj[el] !== null && obj[el] !== undefined && obj[el] !== '') {
        newObj[el] = obj[el];
      }
    });
    return newObj;
};

exports.createTenXSubscription = async(req, res, next)=>{
    console.log(req.body)
    const{
        plan_name, actual_price, discounted_price, features, validity, validityPeriod,
        status, portfolio, profitCap } = req.body;
    if(await TenXSubscription.findOne({plan_name, status: "Active" })) return res.status(400).json({message:'This subscription already exists.'});

    const tenXSubs = await TenXSubscription.create({plan_name:plan_name.trim(), actual_price, discounted_price, features, validity, validityPeriod,
        status, createdBy: req.user._id, lastModifiedBy: req.user._id, portfolio, profitCap});
    
    res.status(201).json({message: 'TenX Subscription successfully created.', data:tenXSubs});
}

exports.editTanx = async(req, res, next) => {
    const id = req.params.id;

    console.log("id is ,", id)
    const tenx = await TenXSubscription.findById(id);

    const filteredBody = filterObj(req.body, "plan_name", "actual_price", "discounted_price", "validity", "validityPeriod", 
        "status", "profitCap", "portfolio");
    if(req.body.features)filteredBody.features=[...tenx.features,
        {orderNo:req.body.features.orderNo,
            description:req.body.features.description,}]
    filteredBody.lastModifiedBy = req.user._id;    

    console.log(filteredBody)
    const updated = await TenXSubscription.findByIdAndUpdate(id, filteredBody, { new: true });

    res.status(200).json({message: 'Successfully edited tenx.', data: updated});
}

exports.editFeature = async(req, res, next) => {
    const id = req.params.id;
    const {orderNo, description} = req.body;

    console.log("id is ,", id)
    const updated = await TenXSubscription.findOneAndUpdate(
        { "features._id": id }, // filter to match the feature object with the given _id
        {
          $set: {
            "features.$.orderNo": orderNo, // set the new orderNo value
            "features.$.description": description, // set the new description value
            lastModifiedBy: req.user._id // set the lastModifiedBy value to the current user's _id
          }
        },
        { new: true } // return the updated document
      );
    res.status(200).json({message: 'Successfully edited tenx.', data: updated});
}

exports.removeFeature = async(req, res, next) => {
    const id = req.params.id;
    // const {orderNo, description} = req.body;

    console.log("id is ,", id)
    const updatedDoc = await TenXSubscription.findOneAndUpdate(
        { "features._id": id }, // filter to match the feature object with the given _id
        {
          $pull: { features: { _id: id } }, // remove the feature object with the given _id
          lastModifiedBy: req.user._id // set the lastModifiedBy value to the current user's _id
        },
        { new: true } // return the updated document
      );
    res.status(200).json({message: 'Successfully deleted tenx.', data: updatedDoc});
}

exports.getActiveTenXSubs = async(req, res, next)=>{
    try{
        const tenXSubs = await TenXSubscription.find({status: "Active"})
        .populate('portfolio', 'portfolioName portfolioValue')
        .sort({$natural: 1})
        
        res.status(201).json({status: 'success', data: tenXSubs, results: tenXSubs.length});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }     
};

exports.getInactiveTenXSubs = async(req, res, next)=>{
  try{
      const tenXSubs = await TenXSubscription.find({status: "Inactive"})
      .populate('portfolio', 'portfolioName portfolioValue')
      
      res.status(201).json({status: 'success', data: tenXSubs, results: tenXSubs.length});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }
      
};

exports.getDraftTenXSubs = async(req, res, next)=>{
  try{
      const tenXSubs = await TenXSubscription.find({status: "Draft"})
      .populate('portfolio', 'portfolioName portfolioValue')
      
      res.status(201).json({status: 'success', data: tenXSubs, results: tenXSubs.length});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }
      
};

exports.getTenXSubscription = async(req, res, next)=>{
    
    const id = req.params.id ? req.params.id : '';
    try{
    const tenXSubscription = await TenXSubscription.findById(id)
    .populate('portfolio', 'portfolioName portfolioValue')
    .populate('users.userId','first_name last_name mobile email');

    res.status(201).json({message: "TenXSubscription Retrived",data: tenXSubscription});    
    }
    catch{(err)=>{res.status(401).json({message: "New TenXSubscription", error:err}); }}  
};

exports.createTenXPurchaseIntent = async(req, res, next)=>{
  console.log(req.body)
  try{
  const{ purchase_intent_by, tenXSubscription } = req.body;

  const tenXPurchaseIntent = await TenXPurchaseIntent.create({purchase_intent_by, tenXSubscription});
  console.log(tenXPurchaseIntent)
  res.status(201).json({message: 'TenX Purchase Intent Captured Successfully.', data:tenXPurchaseIntent});
  }
  catch{(err)=>{res.status(401).json({message: "Something went wrong", error:err}); }}  
}

exports.getTenXSubscriptionPurchaseIntent = async(req, res, next)=>{
  const id = req.params.id ? req.params.id : '';
  try{
      const purchaseIntent = await TenXPurchaseIntent.find({tenXSubscription : id})
      .populate('purchase_intent_by', 'first_name last_name mobile email joining_date')

      res.status(201).json({status: 'success', data: purchaseIntent, count: purchaseIntent.length});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }   
};

exports.getBeginnerSubscription = async(req, res, next)=>{
  try{
      const tenXSubs = await TenXSubscription.findOne({plan_name: "Beginner"})
      
      res.status(201).json({status: 'success', data: tenXSubs, results: tenXSubs?.users?.length});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }     
};

exports.getIntermediateSubscription = async(req, res, next)=>{
  try{
      const tenXSubs = await TenXSubscription.findOne({plan_name: "Intermediate"})
      
      res.status(201).json({status: 'success', data: tenXSubs, results: tenXSubs?.users?.length});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }     
};

exports.getProSubscription = async(req, res, next)=>{
  try{
      const tenXSubs = await TenXSubscription.findOne({plan_name: "Pro"})
      
      res.status(201).json({status: 'success', data: tenXSubs, results: tenXSubs?.users?.length});    
  }catch(e){
      console.log(e);
      res.status(500).json({status: 'error', message: 'Something went wrong'});
  }     
};
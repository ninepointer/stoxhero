const TenXSubscription = require("../models/TenXSubscription/TenXSubscriptionSchema");

exports.createTenXSubscription = async(req, res, next)=>{
    console.log(req.body)
    const{
        plan_name, actual_price, discounted_price, features, validity, validityType,
        status } = req.body;
    if(await TenXSubscription.findOne({plan_name, status: "Active" })) return res.status(400).json({message:'This subscription already exists.'});

    const tenXSubs = await TenXSubscription.create({plan_name, actual_price, discounted_price, features, validity, validityType,
        status, createdBy: req.user._id, lastModifiedBy: req.user._id});
    
    res.status(201).json({message: 'TenX Subscription successfully created.', data:tenXSubs});
}







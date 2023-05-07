const TenXSubscription = require("../models/TenXSubscription/TenXSubscriptionSchema");


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
        status } = req.body;
    if(await TenXSubscription.findOne({plan_name, status: "Active" })) return res.status(400).json({message:'This subscription already exists.'});

    const tenXSubs = await TenXSubscription.create({plan_name, actual_price, discounted_price, features, validity, validityPeriod,
        status, createdBy: req.user._id, lastModifiedBy: req.user._id});
    
    res.status(201).json({message: 'TenX Subscription successfully created.', data:tenXSubs});
}

exports.editFeature = async(req, res, next) => {
    const id = req.params.id;

    console.log("id is ,", id)
    const tenx = await TenXSubscription.findById(id);

    const filteredBody = filterObj(req.body, "plan_name", "actual_price", "discounted_price", "validity", "validityPeriod", 
        "status");
    if(req.body.features)filteredBody.features=[...tenx.features,
        {orderNo:req.body.features.orderNo,
            description:req.body.features.description,}]
    filteredBody.lastModifiedBy = req.user._id;    

    console.log(filteredBody)
    await TenXSubscription.findByIdAndUpdate(id, filteredBody);

    res.status(200).json({message: 'Successfully edited tenx.'});
}







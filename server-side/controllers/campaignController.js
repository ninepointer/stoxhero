const Campaign = require("../models/campaigns/campaignSchema");
const User = require("../models/User/userDetailSchema");


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el) && obj[el] !== null && obj[el] !== undefined && obj[el] !== '') {
        newObj[el] = obj[el];
      }
    });
    return newObj;
};

exports.createCampaign = async(req, res, next)=>{
    console.log(req.body)
    const{
        campaignName, description, campaignFor, campaignLink, campaignCost, campaignCode,
        status } = req.body;
    try{
        if(await Campaign.findOne({campaignCode: campaignCode })) return res.status(400).json({info:'This campaign code already exists.'});
        const campaign = await Campaign.create({campaignName, description, campaignFor, campaignLink, campaignCost, campaignCode,
            status, createdBy: req.user._id, lastModifiedBy: req.user._id});
        console.log("Campaign: ",campaign)
        res.status(201).json({message: 'Campaign created successfully.', data:campaign, count:campaign.length});
    }catch(error){
        console.log(error)
    } 
}

exports.editCampaign = async(req, res, next) => {
    const id = req.params.id;

    console.log("id is ,", id)
    const tenx = await Campaign.findById(id);

    const filteredBody = filterObj(req.body, "campaignName", "description", "campaignFor", "campaignLink", "campaignCost", "campaignCode", "status");
    filteredBody.lastModifiedBy = req.user._id;    

    console.log(filteredBody)
    const updated = await Campaign.findByIdAndUpdate(id, filteredBody, { new: true });

    res.status(200).json({message: 'Successfully edited Campaign.', data: updated});
}

exports.getCampaigns = async(req, res, next)=>{
    const campaign = await Campaign.find().select('campaignName description campaignFor campaignLink campaignCost campaignCode status users')
    res.status(201).json({message: 'success', data:campaign});
}

exports.getCampaign = async (req,res,next) => {
  console.log("inside getCampaign")
  const {id} = req.params;
  try {
      const campaign = await Campaign.findOne({
        _id: id,
      }).populate("users.userId","first_name last_name email mobile")
      console.log(campaign.users)
      if (!campaign) {
        return res.status(200).json({ status: 'success', message: 'Campaign not found.', data: {} });
      }
        return res.status(200).json({ status: 'success', message: 'Successful', data: campaign });
    } catch (e) {
      console.log(e);
      res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
}

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
    // console.log(req.body)
    const{
        campaignName, description, campaignFor, campaignLink, campaignCost, campaignCode, maxUsers, campaignSignupBonus, isDefault, campaignType,
        status } = req.body;
        console.log(isDefault);
    try{
        if(await Campaign.findOne({campaignCode: campaignCode})) return res.status(400).json({info:'This campaign code already exists.'});
        if(await Campaign.findOne({isDefault:true}) && isDefault==true) return res.status(400).json({info:'There is default active campaign already'});
        const obj={campaignName:campaignName.trim(), description, campaignFor, campaignLink, campaignCost, campaignCode:campaignCode.trim(),
          status, createdBy: req.user._id, lastModifiedBy: req.user._id, maxUsers, isDefault, campaignType,}
          if(campaignSignupBonus.amount) obj.campaignSignupBonus = {amount: campaignSignupBonus?.amount, currency:campaignSignupBonus?.currency};
        const campaign = await Campaign.create(obj);
        // console.log("Campaign: ",campaign)
        res.status(201).json({message: 'Campaign created successfully.', data:campaign, count:campaign.length});
    }catch(error){
        console.log(error)
    } 
}

exports.editCampaign = async(req, res, next) => {
    const id = req.params.id;

    // console.log("id is ,", id)
    const tenx = await Campaign.findById(id);

    let filteredBody = filterObj(req.body, "campaignName", "description", "campaignFor", "campaignLink", "campaignCost", "campaignCode", "status", "maxUsers", "isDefault", "campaignType");
    filteredBody.lastModifiedBy = req.user._id;
    if(req.body?.campaignSignupBonus?.amount){
      filteredBody.campaignSignupBonus.amount = req.body?.campaignSignupBonus?.amount;
    }    
    if(req.body?.campaignSignupBonus?.currency){
      filteredBody.campaignSignupBonus.currency = req.body?.campaignSignupBonus?.currency;
    }    

    // console.log(filteredBody)
    const updated = await Campaign.findByIdAndUpdate(id, filteredBody, { new: true });

    res.status(200).json({message: 'Successfully edited Campaign.', data: updated});
}

exports.getCampaigns = async(req, res, next)=>{
    const campaign = await Campaign.find().select('campaignName description campaignFor campaignLink campaignCost campaignCode status users maxUsers campaignSignupBonus isDefault campaignType')
    res.status(201).json({message: 'success', data:campaign});
}

exports.getCampaignsName = async(req, res, next)=>{
  const campaign = await Campaign.find().select('campaignName status')
  res.status(201).json({message: 'success', data:campaign});
}


exports.getCampaignsByStatus = async(req, res, next)=>{
  const {status} = req.params;
  const campaign = await Campaign.find({status:status}).select('campaignName description campaignFor campaignLink campaignCost campaignCode status users maxUsers campaignSignupBonus isDefault campaignType')
  res.status(201).json({message: 'success', data:campaign});
}

exports.getCampaign = async (req,res,next) => {
  // console.log("inside getCampaign")
  const {id} = req.params;
  try {
      const campaign = await Campaign.findOne({
        _id: id,
      }).populate("users.userId","first_name last_name email mobile")
      // console.log(campaign.users)
      if (!campaign) {
        return res.status(200).json({ status: 'success', message: 'Campaign not found.', data: {} });
      }
        return res.status(200).json({ status: 'success', message: 'Successful', data: campaign });
    } catch (e) {
      console.log(e);
      res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
}

exports.getDefaultInvite = async (req,res,next) => {
  try{
    const campaign = await Campaign.findOne({isDefault:true}).select('campaignCode campaignSignupBonus');
    return res.status(200).json({ status: 'success', message: 'Successful', data: campaign });
  }catch(e){
    console.log(e);
    res.status(500).json({ status: 'error', message: 'Something went wrong', error:e.message});
  }
}
const {sendIndividualNotification, sendMultiNotifications} = require('../../utils/fcmService');
const User = require('../../models/User/userDetailSchema');

exports.sendSingleNotification  = async(req,res,next) => {
    const{title, body, token, mediaUrl, actions}  = req.body;
    try{
        await sendIndividualNotification(title, body, token, mediaUrl, actions);
        res.status(200).json({status:'success', message:'Notification sent'});
    }catch(e){
        console.log(e);
        res.status(500).json({status:'error', error:e.message, message:'Something went wrong.'})
    }
}

exports.sendMultiNotifications = async (req,res, next) => {
    const{title, body, tokens, mediaUrl, actions}  = req.body;
    try{
        await sendMultiNotifications(title, body,tokens, mediaUrl, actions);
        res.status(200).json({status:'success', message:'Notifications sent'});
    }catch(e){
        console.log(e)
        res.status(500).json({status:'error', error:e.message, message:'Something went wrong.'})
    }

}
exports.sendNotificationToSingleUser = async(req,res,next) => {
    const{id} = req.params;
    const{title, body, token, mediaUrl, actions}  = req.body;
    const user = await User.findById(id).select('deviceTokens');
    if(!user){
        return res.status(404).json({status:'error', message:'User not found'});
    }
    const userTokens = User?.deviceTokens;
    if (!userTokens){
        return res.status(404).json({status:'error', message:'User token not found'});
    }
    try{
        await sendMultiNotifications(title, body, userTokens, mediaUrl, actions);
        res.status(200).json({status:'success', message:'Notification sent'});
    }catch(e){
        console.log(e);
        res.status(500).json({status:'error', error:e.message, message:'Something went wrong.'})
    }
}

exports.sendNotificationsToUserGroups = async(req,res, next) =>{
    const{userGroup, title, body, token, mediaUrl, actions} = req.body;
    let tokens = [];
    tokens = fetchTokens(userGroup);
    await sendMultiNotifications(title, body, tokens, mediaUrl, actions);
}

const fetchTokens = async(userGroup) => {
    let tokens = [];
    switch(userGroup){
        case 'MAU':
            tokens = await getMAUTokens();
            break;
        case 'Non-MAU':
            tokens = await getNonMAUTokens();
            break;
        case 'AllActive':
            tokens = await getAllActiveTokens();
            break;
        default:
            console.log('group not defined');
            break;
    }
    return tokens;           
}

exports.getMAUTokens = async () => {
    
}
exports.getNonMAUTokens = async () => {

}
exports.getAllActiveTokens = async () => {

}




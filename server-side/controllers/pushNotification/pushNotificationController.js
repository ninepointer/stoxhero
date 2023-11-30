const {sendIndividualNotification, sendMultiNotifications} = require('../../utils/fcmService');


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
    const user = await User.findById(id).select('deviceToken');
    if(!user){
        return res.status(404).json({status:'error', message:'User not found'});
    }
    const userToken = user?.deviceToken;
    if (!userToken){
        return res.status(404).json({status:'error', message:'User token not found'});
    }
    try{
        await sendIndividualNotification(title, body, token, mediaUrl, actions);
        res.status(200).json({status:'success', message:'Notification sent'});
    }catch(e){
        console.log(e);
        res.status(500).json({status:'error', error:e.message, message:'Something went wrong.'})
    }
}




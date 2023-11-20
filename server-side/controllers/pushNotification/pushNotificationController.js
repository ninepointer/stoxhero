const {sendIndividualNotification, sendMultiNotifications} = require('../../utils/fcmService');


exports.sendSingleNotification  = async(req,res,next) => {
    const{title, body, token}  = req.body;
    try{
        await this.sendIndividualNotification(title, body, token);
        res.status(200).json({status:'success', message:'Notification sent'});
    }catch(e){
        console.log(e);
        res.status(500).json({status:'error', error:e.message, message:'Something went wrong.'})
    }
}

exports.sendMultiNotifications = async (req,res, next) => {
    const{title, body, tokens}  = req.body;
    try{
        await sendMultiNotifications(title, body,tokens);
        res.status(200).json({status:'success', message:'Notifications sent'});
    }catch(e){
        console.log(e)
        res.status(500).json({status:'error', error:e.message, message:'Something went wrong.'})
    }

}
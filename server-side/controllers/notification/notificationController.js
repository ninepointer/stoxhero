const Notification = require('../../models/notifications/notification');
const moment = require('moment');  

exports.createUserNotification = async(notificationOptions, session) => {
    console.log("in notification")
    if(session){
        const notification = await Notification.create([notificationOptions], { session: session });
    }else{
        const notification = await Notification.create(notificationOptions);
        console.log("in notification", notification)
    }
}

exports.getUserNotications = async(req,res, next) => {
    try{
        const notifications = await Notification.find({user:req.user._id, isActive:true});
        res.status(200).json({status:'success', data:notifications});
    }catch(e){
        console.log(e);
        res.status(500).json({status:'error', message:'Something went wrong'});
    }
}

exports.getRecentUserNotifications = async (req, res, next) => {
    try {
        // Calculate the date 3 weekdays ago from today. We assume that the weekdays are Monday to Friday.
        let threeWeekdaysAgo = moment();
        let daysSubtracted = 0;
        while (daysSubtracted < 3) {
            threeWeekdaysAgo = threeWeekdaysAgo.subtract(1, 'days');
            if (threeWeekdaysAgo.isoWeekday() !== 6 && threeWeekdaysAgo.isoWeekday() !== 7) { // 6 and 7 represent Saturday and Sunday respectively.
                daysSubtracted++;
            }
        }

        const notifications = await Notification.find({
            user: req.user._id,
            isActive: true,
            $or: [
                { createdOn: { $gte: threeWeekdaysAgo.toDate() } }, // Notifications created in the last 3 weekdays.
                { priority: 'High' } // Notifications with 'High' priority.
            ]
        })
        .sort({ createdOn: -1 }); // Sorting in descending order to ensure recent notifications come first.

        res.status(200).json({ status: 'success', data: notifications });
    } catch (e) {
        console.error(e);  // It's better to use console.error for errors
        res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
}

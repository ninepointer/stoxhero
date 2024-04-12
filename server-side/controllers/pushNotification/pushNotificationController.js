const {sendIndividualNotification, sendMultiNotifications} = require('../../utils/fcmService');
const User = require('../../models/User/userDetailSchema');
const NotificationGroup = require("../../models/notificationGroup/notificationGroup");
const MarketingNotification = require("../../models/notifications/marketingNotification");
const multer = require('multer');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const {createUserNotification} = require('../../controllers/notification/notificationController');
const csv = require('csv-parser');
const fs = require('fs');

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
console.log("File upload started");
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("application/")) {
    cb(null, true);
} else {
    cb(new Error("Invalid file type"), false);
}
}
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  
  });
  
const upload = multer({ storage, fileFilter }).fields([{ name: "notificationImage", maxCount: 1 }, { name: "csvFile", maxCount: 1 }])
// .single("notificationImage");
console.log("Upload:",upload)
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


exports.uploadMulter = upload;

exports.resizePhoto = (req, res, next) => {
    if (!req.file) {
      // no file uploaded, skip to next middleware
      console.log('no file');
      next();
      return;
    }
    sharp(req.file.buffer).resize({width: 500, height: 500}).toBuffer()
    .then((resizedImageBuffer) => {
      req.file.buffer = resizedImageBuffer;
    //   console.log("Resized:",resizedImageBuffer)
      next();
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Error resizing photo" });
    });
}; 

exports.uploadToS3 = async (req, res, next) => {
    if (!req.file) {
        // no file uploaded, skip to next middleware
        next();
        return;
    }

    // create S3 upload parameters
    const key = `notifications/images/${(Date.now()) + req.file.originalname}`;
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

const getAwsS3Key = async (file) => {
    
    const key = `notifications/images/${(Date.now()) + file.originalname}`;
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read",
        // or another ACL according to your requirements
    };

    try {
        const uploadResult = await s3.upload(params).promise();
        
        return { url: uploadResult.Location, key: key };
    } catch (error) {
        console.error(error);
        throw new Error("Error uploading file to S3");
    }
};

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
    const user = await User.findById(id).select('fcmTokens');
    if(!user){
        return res.status(404).json({status:'error', message:'User not found'});
    }
    const userTokens = User?.fcmTokens;
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

exports.sendGroupNotifications = async (req,res, next) => {
    let {title, body, tokens, mediaUrl, actions, external}  = req.body;
    // console.log('actions', external, actions);
    const {id} = req.params;
    if(!actions){
        actions = 'home'
    }
    
    try{

        const mediaImage = (await getAwsS3Key(req.files["notificationImage"][0])).url;
        const csvFileUrl = await getAwsS3Key(req.files["csvFile"][0]);

        console.log("csvFileUrl", csvFileUrl, mediaImage);
        const fileIs = await downloadCsvFromS3(csvFileUrl);
        // console.log('fileIs', fileIs);
        const getMobile = await extractMobileNumbersFromCsv(fileIs);
        console.log(getMobile);
        
        let users = 0; 
        let success = 0;
        let group;
        if(id === 'csv'){
            for(let user of getMobile){
                const userDoc = await User.findOne({mobile: user}).select("fcmTokens");
                if(userDoc?.fcmTokens?.length >0){
                    users+=1;
                    // console.log('tokens', userDoc?.fcmTokens?.map(item=>item.token))
                    const res = await sendMultiNotifications(title, body,
                    userDoc?.fcmTokens?.map(item=>item.token), mediaImage, {route:actions, external:external == 'true'?true:false}
                    );
                    if(res?.successCount>0){
                        success+=1;
                    }    
                }
            }  
        } else{
            group = await NotificationGroup.findById(id);
            let groupUsers = group.users;
            for(let user of groupUsers){
                const userDoc = await User.findById(user).select("fcmTokens");
                if(userDoc?.fcmTokens?.length >0){
                    users+=1;
                    // console.log('tokens', userDoc?.fcmTokens?.map(item=>item.token))
                    const res = await sendMultiNotifications(title, body,
                    userDoc?.fcmTokens?.map(item=>item.token), mediaImage, {route:actions, external:external == 'true'?true:false}
                    );
                    if(res?.successCount>0){
                        success+=1;
                    }    
                }
            }
        }
        
        const marketingNotification = await MarketingNotification.create({
            title,
            body,
            mediaUrl:mediaImage ?? '',
            actions: actions??'',
            notificationGroup: group?._id || null,
            createdBy: req.user._id,
            mobilesFile: csvFileUrl.url,
            lastModifiedBy: req.user._id,
            userCount:users,
            successfulDeliveryCount:success
        });
        if(group){
            group.notifications?.push(marketingNotification._id);
            group.lastNotificationTime = new Date();
            await group.save({validateBeforeSave:false});    
        }
        console.log('count', users, success);
        res.status(200).json({status:'success', message:'Notifications sent'});
    }catch(e){
        console.log(e)
        res.status(500).json({status:'error', error:e.message, message:'Something went wrong.'})
    }

}


async function downloadCsvFromS3(s3URL) {
    // const urlParts = s3URL.split('/');
    // const bucketName = urlParts[2];
    // const key = urlParts.slice(3).join('/');

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: s3URL.key,
    };

    const data = await s3.getObject(params).promise();
    return data.Body.toString('utf-8');
}

//   function extractMobileNumbersFromCsv(csvData) {
//     const mobileNumbers = [];
//     console.log('csvData', csvData)
//     // csvData.pipe(csv())
//     //         .on('data', async (row) => {
//     //             console.log(row)
                
//     //         })
//     //         .on('end', () => {
//     //             console.log('CSV file successfully processed');
//     //             // res &&
//     //             // res.send('CSV file successfully processed')
//     //         });
  
//     return mobileNumbers;
//   }

async function extractMobileNumbersFromCsv(csvData) {
    try{
        return new Promise((resolve, reject) => {
            const mobileNumbers = [];
            const parser = csv({ headers: true });
            let isFirstRow = true;

           

              let mobileKey ;
            parser.on('data', (row) => {
                if (isFirstRow) {
                    for(const elem in row){
                        if(row[elem].includes('mobile') || row[elem].includes('Mobile') || row[elem].includes('phone') || row[elem].includes('Phone')){
                            mobileKey = elem;
                        }
                    }
                    isFirstRow = false;
                } else{
                    console.log(row[mobileKey], mobileKey, isFirstRow)
                    mobileNumbers.push(row[mobileKey]);
                }
               
            });
    
            parser.on('end', () => {
                resolve(mobileNumbers);
            });
    
            parser.on('error', (err) => {
                reject(err);
            });
    
            // Write the CSV data to the parser
            parser.write(csvData);
            parser.end();
        });
    } catch(err){
        console.log(err);
    }
}
  


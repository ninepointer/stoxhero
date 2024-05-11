const { ObjectId } = require("mongodb");
const User = require("../models/User/userDetailSchema");
const UserWallet = require("../models/UserWallet/userWalletSchema");
const ActivationData = require('../models/campaigns/activationProgram');
const { createUserNotification } = require("../controllers/notification/notificationController");
const { sendMultiNotifications } = require("../utils/fcmService");
const uuid = require("uuid");

exports.activationBonus = async(userId) => {
    try{
        const programeStartDate = '2024-05-09T18:30:00.000+00:00';
        const user = await User.findOne({_id: new ObjectId(userId)});

        if(new Date(programeStartDate) < new Date(user?.joining_date)){
            const activation = await ActivationData.findOne({status: 'Active'});

            const referredUser = await User.findOneAndUpdate(
                
                {_id: new ObjectId(user?.referredBy), "referrals.referredUserId": new ObjectId(userId) }, // Match the referredUserId
                {
                    $set: {
                        "referrals.$.activationDate": new Date(),
                        "referrals.$.activationEarning": activation?.rewardPeractivation,
                        "referrals.$.activationProgram": activation?._id
                    },
                },
                {new : true}
            );

            if(activation?.activationSignupBonus?.amount){
                await addBonus(
                    user, 
                    activation?.activationSignupBonus?.amount, 
                    activation?.activationSignupBonus?.currency,
                    'Activation Bonus',
                    `Amount credited for activation`
                )
            }

            if(activation?.rewardPeractivation){
                await addBonus(
                    referredUser, 
                    activation?.rewardPeractivation, 
                    activation?.currency,
                    'Activation Bonus',
                    `Amount credited for activation of ${user?.first_name} ${user?.last_name}`
                )
            }
        }
    }catch(e){
        console.log(e);
    }
}

const addBonus = async (user, amount, currency, title, description) => {
    const wallet = await UserWallet.findOne({ userId: new ObjectId(user?._id) });
    try {
        wallet?.transactions?.push({
            title: title,
            description: `Amount credited for activation bonus.`,
            amount: amount,
            transactionId: uuid.v4(),
            transactionDate: new Date(),
            transactionType: currency,
        });
        await wallet?.save({ validateBeforeSave: false });

        await createUserNotification({
            title: title,
            description: description,
            // `Amount credited for referral of ${populatedUser?.first_name} ${populatedUser?.last_name}`,
            notificationType: "Individual",
            notificationCategory: "Informational",
            productCategory: "SignUp",
            user: user?._id,
            priority: "Medium",
            channels: ["App", "Email"],
            createdBy: "63ecbc570302e7cf0153370c",
            lastModifiedBy: "63ecbc570302e7cf0153370c",
        });
        if (user?.fcmTokens?.length > 0) {
            await sendMultiNotifications(
                title,
                ``,
                user?.fcmTokens?.map((item) => item.token),
                null,
                { route: "wallet" }
            );
        }
    } catch (e) {
        console.log(e);
    }
};

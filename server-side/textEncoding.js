// // Sample data


// // Create a TextEncoder instance
// const textEncoder = new TextEncoder();

// // // Encode the data to binary (Uint8Array)
// const binaryData = textEncoder.encode(originalData);

// console.log(binaryData); // Output: Uint8Array(50) [ 72, 101, 108, 108, 111, ... ]

// // // Create a TextDecoder instance
// const textDecoder = new TextDecoder();

// // // Decode the binary data back to the original text
// const decodedData = textDecoder.decode(binaryData);

// console.log(decodedData[0], decodedData[1]);


// const Entities = require('html-entities').AllHtmlEntities;
// const entities = new Entities();

// const encodedHtml = "<p><strong><em>Hello</em></strong>,</p><p>I am Vijay Verma</p>";
// const decodedHtml = entities.decode(encodedHtml);

// console.log(decodedHtml);

// const {decode} = require('html-entities');
// // const entities = new Entities();

// const encodedHtml = "&lt;p>Hello dear&lt;/p>";
// const decodedHtml = decode(encodedHtml);

// console.log(decodedHtml);

const io = require('socket.io-client');
const url = 'http://43.204.7.180'; // Replace with your server URL
const options = {
    transports: ['websocket'],
    'force new connection': true
};

const numberOfClients = 380; // Number of simulated clients

for (let i = 0; i < numberOfClients; i++) {
    const client = io.connect(url, options);

    client.on('connect', () => {
        console.log('Client connected:', client.id);

        // Perform actions through the socket as needed
        client.emit('connection', true);

        // Optionally, disconnect after some time or actions
        // setTimeout(() => client.disconnect(), 10000);
    });

    client.on('disconnect', () => {
        console.log('Client disconnected:', client.id);
    });

    // Handle other events and errors as needed
}
















exports.handleDeductCourseFee = async (
    userId,
    courseFee,
    courseName,
    courseId,
    coupon,
    bonusRedemption,
    req
  ) => {
    try {
      let affiliate, affiliateProgram;
      const course = await Course.findOne({ _id: new ObjectId(courseId) });
      const wallet = await UserWallet.findOne({ userId: userId });
      const user = await User.findOne({ _id: userId });
      const setting = await Setting.find({});
      let discountAmount = 0;
      let cashbackAmount = 0;
      const cashTransactions = wallet?.transactions?.filter((transaction) => {
        return transaction.transactionType === "Cash";
      });
      const bonusTransactions = wallet?.transactions?.filter((transaction) => {
        return transaction.transactionType === "Bonus";
      });
  
      const totalCashAmount = cashTransactions?.reduce((total, transaction) => {
        return total + transaction?.amount;
      }, 0);
      const totalBonusAmount = bonusTransactions?.reduce((total, transaction) => {
        return total + transaction?.amount;
      }, 0);
  
      //check course is lived
  
      if (course?.status !== "Published") {
        return {
          statusCode: 400,
          data: {
            status: "error",
            message: "This course is not valid. Please join another one.",
          },
        };
      }
  
      if (
        course?.courseStartTime &&
        course?.courseEndTime &&
        course?.courseEndTime <= new Date()
      ) {
        return {
          statusCode: 400,
          data: {
            status: "error",
            message: "This course has ended. Please join another one.",
          },
        };
      }
  
      //Check if Bonus Redemption is valid
      // console.log(bonusRedemption , totalBonusAmount , bonusRedemption , course?.discountedPrice , setting[0]?.maxBonusRedemptionPercentage, (bonusRedemption > totalBonusAmount) , (bonusRedemption > (course?.discountedPrice * setting[0]?.maxBonusRedemptionPercentage)))
      if (
        bonusRedemption > totalBonusAmount ||
        bonusRedemption >
          course?.discountedPrice * setting[0]?.maxBonusRedemptionPercentage
      ) {
        return {
          statusCode: 400,
          data: {
            status: "error",
            message: "Incorrect HeroCash Redemption",
          },
        };
      }
  
      if (Number(bonusRedemption)) {
        wallet?.transactions?.push({
          title: "StoxHero HeroCash Redeemed",
          description: `${bonusRedemption} HeroCash used.`,
          transactionDate: new Date(),
          amount: -bonusRedemption?.toFixed(2),
          transactionId: uuid.v4(),
          transactionType: "Bonus",
        });
      }
  
      if (coupon) {
        let couponDoc = await Coupon.findOne({ code: coupon });
        if (!couponDoc) {
          let match = false;
          const affiliatePrograms = await AffiliateProgram.find({
            status: "Active",
          });
          if (affiliatePrograms.length != 0) {
            for (let program of affiliatePrograms) {
              match = program?.affiliates?.find(
                (item) =>
                  item?.affiliateCode?.toString() == coupon?.toString() &&
                  item?.affiliateStatus == "Active"
              );
              if (match) {
                affiliate = match;
                affiliateProgram = program;
                couponDoc = {
                  rewardType: "Discount",
                  discountType: "Percentage",
                  discount: program?.discountPercentage,
                  maxDiscount: program?.maxDiscount,
                };
                break;
              }
            }
          }
  
          if (!match) {
            const userCoupon = await User.findOne({
              myReferralCode: coupon?.toString(),
            });
            const referralProgram = await ReferralProgram.findOne({
              status: "Active",
            });
  
            // console.log("referralProgram", referralProgram, userCoupon)
            if (userCoupon) {
              affiliate = { userId: userCoupon?._id };
              affiliateProgram = referralProgram?.affiliateDetails;
              couponDoc = {
                rewardType: "Discount",
                discountType: "Percentage",
                discount: referralProgram?.affiliateDetails?.discountPercentage,
                maxDiscount: referralProgram?.affiliateDetails?.maxDiscount,
              };
            }
          }
        }
        if (couponDoc?.rewardType == "Discount") {
          if (couponDoc?.discountType == "Flat") {
            //Calculate amount and match
            discountAmount = couponDoc?.discount;
          } else {
            discountAmount = Math.min(
              (couponDoc?.discount / 100) * course?.discountedPrice,
              couponDoc?.maxDiscount
            );
          }
        } else {
          if (couponDoc?.discountType == "Flat") {
            //Calculate amount and match
            cashbackAmount = couponDoc?.discount;
          } else {
            cashbackAmount = Math.min(
              (couponDoc?.discount / 100) *
                (course?.discountedPrice - bonusRedemption),
              couponDoc?.maxDiscount
            );
          }
          wallet?.transactions?.push({
            title: "StoxHero CashBack",
            description: `Cashback of ${cashbackAmount?.toFixed(
              2
            )} HeroCash - code ${coupon} used`,
            transactionDate: new Date(),
            amount: cashbackAmount?.toFixed(2),
            transactionId: uuid.v4(),
            transactionType: "Bonus",
          });
        }
      }
  
      const totalAmount =
        (course?.discountedPrice - discountAmount - bonusRedemption) *
        (1 + setting[0]?.courseGstPercentage / 100); //todo-vijay
  
      // console.log(Number(totalAmount)?.toFixed(2) , Number(courseFee)?.toFixed(2), totalAmount, course?.discountedPrice , discountAmount , bonusRedemption , (1 + setting[0]?.courseGstPercentage / 100))
      if (Number(totalAmount)?.toFixed(2) != Number(courseFee)?.toFixed(2)) {
        return {
          statusCode: 400,
          data: {
            status: "error",
            message: "Incorrect Course fee amount",
          },
        };
      }
      if (totalCashAmount < Number(courseFee)) {
        return {
          statusCode: 400,
          data: {
            status: "error",
            message:
              "You do not have enough balance to enroll in this Course. Please add money to your StoxHero Wallet.",
          },
        };
      }
  
      for (let i = 0; i < course.enrollments?.length; i++) {
        if (course.enrollments[i]?.userId?.toString() === userId?.toString()) {
          return {
            statusCode: 400,
            data: {
              status: "error",
              message: "You have already enrolled in this Course.",
            },
          };
        }
      }
  
      if (
        course?.maxEnrolments &&
        course?.maxEnrolments <= course?.enrollments?.length
      ) {
  
        return {
          statusCode: 400,
          data: {
            status: "error",
            message:
              "The course is already full. We sincerely appreciate your enthusiasm to enrollment in our courses. Please enroll in other courses.",
          },
        };
      }
  
      const totalAmountWithoutGST = (course?.discountedPrice - (Number(discountAmount) || 0) - (Number(bonusRedemption) || 0));
  
      let obj = {
        userId: userId,
        actualFee: course?.coursePrice,
        discountedFee: course?.discountedPrice,
        discountUsed: discountAmount,
        pricePaidByUser: courseFee,
        gstAmount: (totalAmountWithoutGST * setting[0]?.courseGstPercentage) / 100,
        enrolledOn: new Date(),
      };
      if (Number(bonusRedemption)) {
        obj.bonusRedemption = bonusRedemption;
      }
  
      const updateParticipants = await Course.findOneAndUpdate(
        { _id: new ObjectId(courseId) },
        {
          $push: {
            enrollments: obj,
          },
        },
        { new: true }
      );
  
      wallet.transactions = [
        ...wallet.transactions,
        {
          title: "Course Fee",
          description: `Amount deducted for the course fee of ${courseName}`,
          transactionDate: new Date(),
          amount: -courseFee,
          transactionId: uuid.v4(),
          transactionType: "Cash",
        },
      ];
      await wallet.save();
  
      if (!updateParticipants || !wallet) {
        return {
          statusCode: 404,
          data: {
            status: "error",
            message: "Not found",
          },
        };
      }
  
      if (coupon && cashbackAmount > 0) {
        await createUserNotification({
          title: "StoxHero Cashback",
          description: `${cashbackAmount?.toFixed(
            2
          )} HeroCash added as bonus - ${coupon} code used.`,
          notificationType: "Individual",
          notificationCategory: "Informational",
          productCategory: "Course",
          user: user?._id,
          priority: "Medium",
          channels: ["App", "Email"],
          createdBy: "63ecbc570302e7cf0153370c",
          lastModifiedBy: "63ecbc570302e7cf0153370c",
        });
        if (user?.fcmTokens?.length > 0) {
          await sendMultiNotifications(
            "StoxHero Cashback",
            `${cashbackAmount?.toFixed(
              2
            )}HeroCash credited as bonus in your wallet.`,
            user?.fcmTokens?.map((item) => item.token),
            null,
            { route: "wallet" }
          );
        }
      }
      await createUserNotification({
        title: "Course Fee Deducted",
        description: `₹${courseFee} deducted as Course fee for ${course?.courseName}`,
        notificationType: "Individual",
        notificationCategory: "Informational",
        productCategory: "Course",
        user: user?._id,
        priority: "Low",
        channels: ["App", "Email"],
        createdBy: "63ecbc570302e7cf0153370c",
        lastModifiedBy: "63ecbc570302e7cf0153370c",
      });
      if (user?.fcmTokens?.length > 0) {
        await sendMultiNotifications(
          "Course Fee Deducted",
          `₹${courseFee} deducted as Course fee for ${course?.courseName}`,
          user?.fcmTokens?.map((item) => item.token),
          null,
          { route: "wallet" }
        );
      }
      if (coupon) {
        const product = await Product.findOne({ productName: "Course" }).select(
          "_id"
        );
        if (affiliate) {
          await creditAffiliateAmount(
            affiliate,
            affiliateProgram,
            product?._id,
            course?._id,
            course?.discountedPrice,
            userId
          );
        } else {
          await saveSuccessfulCouponUse(
            userId,
            coupon,
            product?._id,
            course?._id
          );
        }
      }
  
      const pricePaidByUser = courseFee;
      const gst = (totalAmountWithoutGST * setting[0]?.courseGstPercentage) / 100;
      const commissionPercentage = course?.commissionPercentage;
      const totalInfluencer = course?.courseInstructors?.length;
      const finalAmount = ((pricePaidByUser-gst)*commissionPercentage/100)/totalInfluencer;
  
      for(const elem of course?.courseInstructors){
        const wallet = await UserWallet.findOne({ userId: elem?.id });
        wallet.transactions = [
          ...wallet.transactions,
          {
            title: "Course Commission Credited",
            description: `Commission credited for the course purchase of ${courseName}`,
            transactionDate: new Date(),
            amount: finalAmount,
            transactionId: uuid.v4(),
            transactionType: "Cash",
          },
        ];
        await wallet.save({validateBeforeSave: false});
  
        await createUserNotification({
          title: "Course Amount Credited",
          description: `₹${finalAmount} credited as Course purchase of ${course?.courseName}`,
          notificationType: "Individual",
          notificationCategory: "Informational",
          productCategory: "Course",
          user: elem?.id,
          priority: "Low",
          channels: ["App", "Email"],
          createdBy: "63ecbc570302e7cf0153370c",
          lastModifiedBy: "63ecbc570302e7cf0153370c",
        });
      }
  
      return {
        statusCode: 200,
        data: {
          status: "success",
          message:
            "Congratulations on successfully enrolling in the course! It will be a valuable experience for you.",
          data: updateParticipants,
        },
      };
    } catch (e) {
      console.log(e);
      return {
        statusCode: 500,
        data: {
          status: "error",
          message: "Something went wrong",
          error: e.message,
        },
      };
    }
  };
const Quiz = require('../../models/School/Quiz'); // Adjust the path as per your project structure
const AWS = require('aws-sdk');
const {ObjectId} = require('mongodb');
const User = require('../../models/User/userDetailSchema');
const moment = require('moment');
const sharp = require('sharp');

// Configure AWS
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// Function to upload a file to S3
const getAwsS3Url = async (file) => {
    if(file){
        file.buffer = await sharp(file.buffer)
        .resize({ width: 512, height: 256 })
        .toBuffer();
    }
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `quiz/${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
         // or another ACL according to your requirements
    };

    try {
        const uploadResult = await s3.upload(params).promise();
        return uploadResult.Location;
    } catch (error) {
        console.error(error);
        throw new Error('Error uploading file to S3');
    }
};

exports.createQuiz = async (req, res) => {
    try {
        const {grade, title, startDateTime, registrationOpenDateTime, registrationCloseDateTime,
            durationInSeconds, rewardType, status, maxParticipant, city, 
            openForAll, description, noOfSlots, slotBufferTime, entryFee } = req.body;

        const openAll = (openForAll === 'false' || openForAll === 'undefined' || openForAll === false) ? false : true;
        let image;
        if (req.files['quizImage']) {
            image = await getAwsS3Url(req.files['quizImage'][0]);
        }

        const slots = [];
        slots.push({ time: new Date(startDateTime) });
        for (let i = 1; i < noOfSlots; i++) {
            const previousSlotTime = new Date(slots[i - 1].time);
            const nextSlotTime = new Date(previousSlotTime.getTime() + (Number(durationInSeconds) + Number(slotBufferTime)) * 1000);
            slots.push({ time: nextSlotTime });
        }

        const newQuiz = new Quiz({image, maxParticipant, grade, title, entryFee,
            startDateTime, registrationOpenDateTime, registrationCloseDateTime, durationInSeconds, 
            rewardType, status, city, openForAll: openAll, description,
            noOfSlots, slotBufferTime, slots
         });
        await newQuiz.save();
        res.status(201).json(newQuiz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.editQuiz = async (req, res) => {
    try {
        const quizId = req.params.id;
        const updates = req.body;

        const slots = [];
        slots.push({ time: new Date(updates.startDateTime) });
        for (let i = 1; i < updates.noOfSlots; i++) {
            const previousSlotTime = new Date(slots[i - 1].time);
            const nextSlotTime = new Date(previousSlotTime.getTime() + (Number(updates.durationInSeconds) + Number(updates.slotBufferTime)) * 1000);
            slots.push({ time: nextSlotTime });
        }

        updates.slots = slots;
        updates.openForAll = (updates?.openForAll === 'false' || updates?.openForAll === 'undefined' || updates?.openForAll === false) ? false : true;
        
        if (req.files['quizImage']) {
            updates.image = await getAwsS3Url(req.files['quizImage'][0]);
        }
        const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, updates, { new: true });
        if (!updatedQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.status(201).json({status: "success", data: updatedQuiz });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Assuming this is your controller function
exports.addQuestionToQuiz = async (req, res) => {
    try {
        const quizId = req.params.quizId;
        const { title, type, score } = req.body;

        let questionImageUrl = null;
        // const optionImages = [];

        // Handle question image upload
        if (req.files['questionImage']) {
            questionImageUrl = await getAwsS3Url(req.files['questionImage'][0]);
        }

        const newQuestion = {
            title,
            type,
            questionImage: questionImageUrl,
            score,
            // options: await Promise.all(options.map(async opt => {
            //     let optionImageUrl = null;
            //     if (opt.image) {
            //         optionImageUrl = await getAwsS3Url(opt.image); // Assuming opt.image is the file object
            //     }
            //     return {
            //         optionKey: opt.key, 
            //         optionText: opt.text, 
            //         optionImage: optionImageUrl, 
            //         isCorrect: opt.isCorrect
            //     };
            // }))
        };

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        quiz.questions.push(newQuestion);
        await quiz.save();
        res.json(quiz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getQuizQuestion = async (req, res)=>{
    try {
        const quizId = req.params.quizId;
        const quiz = await Quiz.findById(new ObjectId(quizId)).select('questions _id');
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.status(201).json({status: "success", data: quiz });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.editQuestionInQuiz = async (req, res) => {
    try {
        const { quizId, questionId } = req.params;
        const updates = req.body; // This will contain only the fields to be updated

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const questionIndex = quiz.questions.findIndex(q => q._id.toString() === questionId);
        if (questionIndex === -1) {
            return res.status(404).json({ message: 'Question not found' });
        }

        let question = quiz.questions[questionIndex];

        // Update text fields if provided
        if (updates.title) question.title = updates.title;
        if (updates.type) question.type = updates.type;
        if (updates.score) question.score = updates.score;

        // Handle question image upload if a new file is provided
        if (req.files['questionImage']) {
            question.questionImage = await getAwsS3Url(req.files['questionImage'][0]);
        }

        await quiz.save();
        res.json(quiz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.editOptionInQuiz = async (req, res) => {
    try {
        const { quizId, questionId, optionId } = req.params;
        let { optionKey, optionText, isCorrect } = req.body;
        isCorrect = (isCorrect === 'false' || isCorrect === 'undefined' || isCorrect === false) ? false : true;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        let filterQue = quiz.questions.filter((elem)=>{
            return elem?._id?.toString() === questionId?.toString();
        })

        let filterOpt = filterQue[0]?.options?.filter((elem)=>{
            return elem?._id?.toString() === optionId?.toString();
        })

        filterOpt[0].optionKey = optionKey;
        filterOpt[0].optionText = optionText;
        filterOpt[0].isCorrect = isCorrect;

        if (req.files['optionImage']) {
            filterOpt[0].optionImage = await getAwsS3Url(req.files['optionImage'][0]);
        }

        const newData = await quiz.save({new: true});

        let newfilterQue = newData.questions.filter((elem)=>{
            return elem?._id?.toString() === questionId?.toString();
        })


        let newfilterOpt = newfilterQue[0]?.options?.filter((elem)=>{
            return elem?._id?.toString() === optionId?.toString();
        })
        
        res.status(201).json({status: "success", data: newfilterQue[0]?.options });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.addOptionToQuiz = async (req, res) => {
    try {
        const {quizId, questionId} = req.params;
        let { optionKey, optionText, isCorrect } = req.body;
        isCorrect = (isCorrect === 'false' || isCorrect === 'undefined' || isCorrect === false) ? false : true;
        let imageUrl = null;
        // const optionImages = [];

        // Handle question image upload
        if (req.files['optionImage']) {
            imageUrl = await getAwsS3Url(req.files['optionImage'][0]);
        }

        const newOption = {
            optionKey,
            optionText, isCorrect,
            optionImage: imageUrl,
        };

        const quiz = await Quiz.findById(quizId);
        let filter = quiz.questions.filter((elem)=>{
            return elem?._id?.toString() === questionId?.toString();
        })
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        filter[0].options.push(newOption); 
        const newData = await quiz.save({new: true});

        const optionData = newData?.questions?.filter((elem)=>{
            return elem?._id?.toString() === questionId?.toString();
        })
        res.status(201).json({status: "success", data: optionData[0] });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({}).populate('city', 'name');
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getQuizForAdmin = async (req, res) => {
    try {
        const quizId = req.params.id;
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getActiveQuizForAdmin = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ status: "Active" })
        .populate({
            path: 'registrations.userId',
            select: 'student_name full_name mobile schoolDetails',
            populate: {
                path: 'schoolDetails',
                populate: [
                    {
                        path: 'city',
                        select: 'name code'
                    },
                    {
                        path: 'school',
                        select: 'school_name'
                    }
                ]
            }
        });
    
    
        res.status(201).json({ status: 'success', data: quizzes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDraftQuizForAdmin = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ status: "Draft" })
                .populate({
            path: 'registrations.userId',
            select: 'student_name full_name mobile schoolDetails',
            populate: {
                path: 'schoolDetails',
                populate: [
                    {
                        path: 'city',
                        select: 'name code'
                    },
                    {
                        path: 'school',
                        select: 'school_name'
                    }
                ]
            }
        });
    
        res.status(201).json({ status: 'success', data: quizzes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getInActiveQuizForAdmin = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ status: "Inactive" })
                .populate({
            path: 'registrations.userId',
            select: 'student_name full_name mobile schoolDetails',
            populate: {
                path: 'schoolDetails',
                populate: [
                    {
                        path: 'city',
                        select: 'name code'
                    },
                    {
                        path: 'school',
                        select: 'school_name'
                    }
                ]
            }
        });
    
        res.status(201).json({ status: 'success', data: quizzes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCompletedQuizForAdmin = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ status: "Completed" })
        .populate({
            path: 'registrations.userId',
            select: 'student_name full_name mobile schoolDetails',
            populate: {
                path: 'schoolDetails',
                populate: [
                    {
                        path: 'city',
                        select: 'name code'
                    },
                    {
                        path: 'school',
                        select: 'school_name'
                    }
                ]
            }
        });
    
        res.status(201).json({ status: 'success', data: quizzes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//------------user------------------

exports.getQuizForUser = async (req, res) => {
    try {
        const quizId = req.params.id;
        const quiz = await Quiz.findById(quizId, '-registrations -createdOn -lastmodifiedOn -createdBy -lastmodifiedBy').lean(); // Exclude fields
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Remove the isCorrect field from options
        quiz.questions.forEach(question => {
            if (question.options) {
                question.options.forEach(option => {
                    delete option.isCorrect;
                });
            }
        });

        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllQuizzesForUser = async (req, res) => {
    try {
        const now = new Date();
        const userId = req.user._id;

        const user = await User.findById(userId).select('schoolDetails');
            const quizzes = await Quiz.aggregate([
                {
                    $match: {
                        $and: [
                            {"registrations.userId": {$ne: new ObjectId(userId)}},
                             // Existing condition that must always be true
                            { // At least one of these conditions must be satisfied
                                $or: [
                                    {"city": user?.schoolDetails?.city}, // Assuming city is already an ObjectId or the correct type
                                    {"openForAll": true}
                                ]
                            },
                            { // At least one of these conditions must be satisfied
                               "grade": user?.schoolDetails?.grade, // Assuming city is already an ObjectId or the correct type
                            },
                            {
                                startDateTime: {$gt: new Date()}
                            }
                        ]
                    }
                },
                {
                    $project: {
                        image: 1,
                        maxParticipant: 1,
                        title: 1,
                        startDateTime: 1,
                        registrationOpenDateTime: 1,
                        registrationCloseDateTime: 1,
                        durationInSeconds: 1,
                        rewardType: 1,
                        noOfSlots: 1,
                        status: 1,
                        grade:1,
                        entryFee:1,
                        registrationsCount: {
                            $size: "$registrations" // Include the length of the registrations array
                        }
                    }
                }
            ]).exec();
        res.status(201).json({status: "success", data: quizzes });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyQuizzesForUser = async (req, res) => {
    try {
        const now = new Date();
        const userId = req.user._id;
        const quizzes = await Quiz.aggregate([
            {
                $match: {
                    "registrations.userId": new ObjectId(userId),
                    startDateTime: {$gt: new Date()}
                }
            },
            {
                $project: {
                    image: 1,
                    maxParticipant: 1,
                    title: 1,
                    startDateTime: 1,
                    registrationOpenDateTime: 1,
                    registrationCloseDateTime: 1,
                    durationInSeconds: 1,
                    rewardType: 1,
                    status: 1,
                    grade: 1,
                    registrationsCount: {
                        $size: "$registrations" // Include the length of the registrations array
                    }
                }
            }
        ]).exec();
        
        res.status(201).json({status: "success", data: quizzes });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.registration = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user._id;
        const {slotId} = req.body;
        const user = await User.findById(userId).select('schoolDetails dob mobile').populate('schoolDetails.city', 'name code');

        const getquiz = await Quiz.findById(new ObjectId(id));
        if(!getquiz) return res.status(500).json({status: 'error', message: "Quiz not found."  });

        for(let elem of getquiz.slots){
            if((elem?._id?.toString() === slotId?.toString()) && (elem?.user >= getquiz?.maxParticipant)){
                return res.status(500).json({status: 'error', message: "This slot is full please try in another slot."  });
            }
        }

        const registrationId = getRegistrationId(user?.schoolDetails?.city?.code, user?.mobile, getquiz?.startDateTime, user?.schoolDetails?.grade)
        
        if(getquiz?.registrationOpenDateTime > new Date()){
            return res.status(500).json({status: 'error', message: "Registration for this quiz has not started yet. Please wait until registration opens."  });
        }

        const quiz = await Quiz.findOneAndUpdate(
            {
                _id: new ObjectId(id),
                'slots._id': new ObjectId(slotId), // Match the specific slotId
            },
            {
                $push: {
                    registrations: {
                        userId: userId,
                        registeredOn: new Date(),
                        registrationId,
                        slotId,
                    },
                },
                $inc: { 'slots.$.user': 1 }, // Increment the user count by 1 for the matched slotId
            },
            { new: true }
        );
          
        const quizzes = await Quiz.aggregate([
            {
                $match: {
                    $and: [
                        {"registrations.userId": {$ne: new ObjectId(userId)}},
                         // Existing condition that must always be true
                        { // At least one of these conditions must be satisfied
                            $or: [
                                {"city": user?.schoolDetails?.city}, // Assuming city is already an ObjectId or the correct type
                                {"openForAll": true}
                            ]
                        },
                        { // At least one of these conditions must be satisfied
                           "grade": user?.schoolDetails?.grade, // Assuming city is already an ObjectId or the correct type
                        }
                    ]
                }
            },
            {
                $project: {
                    image: 1,
                    maxParticipant: 1,
                    title: 1,
                    startDateTime: 1,
                    registrationOpenDateTime: 1,
                    registrationCloseDateTime: 1,
                    durationInSeconds: 1,
                    rewardType: 1,
                    grade:1,
                    status: 1,
                    registrationsCount: {
                        $size: "$registrations" // Include the length of the registrations array
                    }
                }
            }
        ]).exec();

        let quizDate;
        for(let elem of getquiz.slots){
            if((elem?._id?.toString() === slotId?.toString())){
                quizDate = moment(elem?.time).add(5, 'hours').add(30, 'minutes').format('DD-MM-YYYY hh:mm A');
            }
        }

        

        res.status(201).json({status: "success", data: quizzes, message: `Thank you for registering. The olympiad will start on ${quizDate}.` });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSlot = async (req, res) => {
    try {
        // 65bd1597d0283f5f82e70cd9
        const { id } = req.params;
        const quizData = await Quiz.findOne({_id: new ObjectId(id)})?.select('maxParticipant slots')
        const slots = quizData?.slots;
        const maxParticipant = quizData?.maxParticipant;

        const data = [];
        for(let elem of slots){
            data.push({
                slotTime: elem?.time,
                slotId: elem?._id,
                spotLeft: maxParticipant - (elem?.user || 0)
            })
        }

        res.status(201).json({status: "success", data: data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

function getRegistrationId( cityCode, mobile, quizStartDate, grade) {
    const quizDate = new Date(quizStartDate);

    const quizDay = quizDate?.getDate()?.toString()?.padStart(2, '0');
    const quizMonth = (quizDate.getMonth() + 1)?.toString()?.padStart(2, '0');
    const quizYear = quizDate?.getFullYear()?.toString()?.slice(-2); // Extract last two digits of the year

    const mobileLast2Digit = mobile?.slice(-4);
    const newCityCode = cityCode?.toString()?.padStart(2, '0'); // Ensure city code is two digits
    const gradeChars = grade?.toString()?.slice(0, -2)?.padStart(2, '0');
    return (`SHF${gradeChars}${quizDay}${quizMonth}${quizYear}${newCityCode}${mobileLast2Digit}`);
}

exports.handleOlympiadParticipation = async (paymentBy, quizId, productDetails) => {
    try {
        const id = quizId;
        const userId = paymentBy;
        const {slotId} = productDetails;
        const user = await User.findById(userId).select('schoolDetails dob mobile').populate('schoolDetails.city', 'name code');

        const getquiz = await Quiz.findById(new ObjectId(id));
        if(!getquiz) return res.status(500).json({status: 'error', message: "Quiz not found."  });

        for(let elem of getquiz.slots){
            if((elem?._id?.toString() === slotId?.toString()) && (elem?.user >= getquiz?.maxParticipant)){
                return res.status(500).json({status: 'error', message: "This slot is full please try in another slot."  });
            }
        }

        const registrationId = getRegistrationId(user?.schoolDetails?.city?.code, user?.mobile, getquiz?.startDateTime, user?.schoolDetails?.grade)
        
        if(getquiz?.registrationOpenDateTime > new Date()){
            return res.status(500).json({status: 'error', message: "Registration for this quiz has not started yet. Please wait until registration opens."  });
        }

        const quiz = await Quiz.findOneAndUpdate(
            {
                _id: new ObjectId(id),
                'slots._id': new ObjectId(slotId), // Match the specific slotId
            },
            {
                $push: {
                    registrations: {
                        userId: userId,
                        registeredOn: new Date(),
                        registrationId,
                        slotId,
                    },
                },
                $inc: { 'slots.$.user': 1 }, // Increment the user count by 1 for the matched slotId
            },
            { new: true }
        );
          
        const quizzes = await Quiz.aggregate([
            {
                $match: {
                    $and: [
                        {"registrations.userId": {$ne: new ObjectId(userId)}},
                         // Existing condition that must always be true
                        { // At least one of these conditions must be satisfied
                            $or: [
                                {"city": user?.schoolDetails?.city}, // Assuming city is already an ObjectId or the correct type
                                {"openForAll": true}
                            ]
                        },
                        { // At least one of these conditions must be satisfied
                           "grade": user?.schoolDetails?.grade, // Assuming city is already an ObjectId or the correct type
                        }
                    ]
                }
            },
            {
                $project: {
                    image: 1,
                    maxParticipant: 1,
                    title: 1,
                    startDateTime: 1,
                    registrationOpenDateTime: 1,
                    registrationCloseDateTime: 1,
                    durationInSeconds: 1,
                    rewardType: 1,
                    grade:1,
                    status: 1,
                    registrationsCount: {
                        $size: "$registrations" // Include the length of the registrations array
                    }
                }
            }
        ]).exec();

        let quizDate;
        for(let elem of getquiz.slots){
            if((elem?._id?.toString() === slotId?.toString())){
                quizDate = moment(elem?.time).add(5, 'hours').add(30, 'minutes').format('DD-MM-YYYY hh:mm A');
            }
        }

        

        // res.status(201).json({status: "success", data: quizzes, message: `Thank you for registering. The olympiad will start on ${quizDate}.` });

    } catch (error) {
        // res.status(500).json({ message: error.message });
        console.log(error);
    }
}

exports.purchaseIntent = async (req, res) => {
    try {
        const { id } = req.params; // ID of the contest 
        const userId = req.user._id;

        const result = await Quiz.findByIdAndUpdate(
            id,
            { $push: { purchaseIntent: { userId: userId, date: new Date() } } },
            { new: true }  // This option ensures the updated document is returned
        );

        if (!result) {
            return res.status(404).json({ status: "error", message: "Something went wrong." });
        }

        res.status(200).json({
            status: "success",
            message: "Intent Saved successfully",
            // data: result
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: error.message
        });
    }
};



const Quiz = require('../../models/School/Quiz'); // Adjust the path as per your project structure
const AWS = require('aws-sdk');
const {ObjectId} = require('mongodb');

// Configure AWS
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// Function to upload a file to S3
const getAwsS3Url = async (file) => {
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
        const {grade, title, startDateTime, registrationOpenDateTime, durationInSeconds, rewardType, status, maxParticipant } = req.body;

        let image;
        if (req.files['quizImage']) {
            image = await getAwsS3Url(req.files['quizImage'][0]);
        }
        const newQuiz = new Quiz({image, maxParticipant, grade, title, startDateTime, registrationOpenDateTime, durationInSeconds, rewardType, status });
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
        const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, updates, { new: true });
        if (!updatedQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.json(updatedQuiz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Assuming this is your controller function
exports.addQuestionToQuiz = async (req, res) => {
    try {
        const quizId = req.params.quizId;
        const { title, type, score, options } = req.body;

        let questionImageUrl = null;
        const optionImages = [];

        // Handle question image upload
        if (req.files['questionImage']) {
            questionImageUrl = await getAwsS3Url(req.files['questionImage'][0]);
        }

        // Handle option images upload
        if (req.files['optionImages']) {
            for (let file of req.files['optionImages']) {
                const url = await getAwsS3Url(file);
                optionImages.push(url);
            }
        }

        const newQuestion = {
            title,
            type,
            questionImage: questionImageUrl,
            score,
            options: await Promise.all(options.map(async opt => {
                let optionImageUrl = null;
                if (opt.image) {
                    optionImageUrl = await getAwsS3Url(opt.image); // Assuming opt.image is the file object
                }
                return {
                    optionKey: opt.key, 
                    optionText: opt.text, 
                    optionImage: optionImageUrl, 
                    isCorrect: opt.isCorrect
                };
            }))
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

        // Handle options, if provided
        if (updates.options) {
            updates.options.forEach(async (updatedOption, index) => {
                let option = question.options[index];

                // Update text fields of the option
                if (updatedOption.key) option.optionKey = updatedOption.key;
                if (updatedOption.text) option.optionText = updatedOption.text;
                if (typeof updatedOption.isCorrect === 'boolean') option.isCorrect = updatedOption.isCorrect;

                // Handle option image upload if a new file is provided
                if (req.files['optionImages'] && req.files['optionImages'][index]) {
                    option.optionImage = await getAwsS3Url(req.files['optionImages'][index]);
                }
            });
        }

        await quiz.save();
        res.json(quiz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({});
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
        const quizzes = await Quiz.find({status: "Active"});
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
        // const quizzes = await Quiz.find({"registrations.userId": {$ne: new ObjectId(userId)}}, 'image maxParticipant title startDateTime registrationOpenDateTime durationInSeconds rewardType status')
        //     .lean()

            const quizzes = await Quiz.aggregate([
                {
                    $match: {
                        "registrations.userId": {$ne: new ObjectId(userId)}
                    }
                },
                {
                    $project: {
                        image: 1,
                        maxParticipant: 1,
                        title: 1,
                        startDateTime: 1,
                        registrationOpenDateTime: 1,
                        durationInSeconds: 1,
                        rewardType: 1,
                        status: 1,
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
                    "registrations.userId": new ObjectId(userId)
                }
            },
            {
                $project: {
                    image: 1,
                    maxParticipant: 1,
                    title: 1,
                    startDateTime: 1,
                    registrationOpenDateTime: 1,
                    durationInSeconds: 1,
                    rewardType: 1,
                    status: 1,
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
        const quiz = await Quiz.findOneAndUpdate({_id: new ObjectId(id)}, {
            $push: {
                registrations: {
                    userId: userId,
                    registeredOn: new Date()
                }
            }
        }, {new: true});

        // const quizzes = await Quiz.find({"registrations.userId": {$ne: new ObjectId(userId)}}, 'image maxParticipant title startDateTime registrationOpenDateTime durationInSeconds rewardType status')
        // .lean()

        const quizzes = await Quiz.aggregate([
            {
                $match: {
                    "registrations.userId": {$ne: new ObjectId(userId)}
                }
            },
            {
                $project: {
                    image: 1,
                    maxParticipant: 1,
                    title: 1,
                    startDateTime: 1,
                    registrationOpenDateTime: 1,
                    durationInSeconds: 1,
                    rewardType: 1,
                    status: 1,
                    registrationsCount: {
                        $size: "$registrations" // Include the length of the registrations array
                    }
                }
            }
        ]).exec();


        res.status(201).json({status: "success", data: quizzes, message: "Registration Successfull" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


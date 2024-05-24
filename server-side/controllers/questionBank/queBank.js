const QuestionBank = require('../../models/QuestionBank/queBankSchema'); // Adjust the path as per your project structure
const AWS = require('aws-sdk');
const {ObjectId} = require('mongodb');
const moment = require('moment');

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

exports.createQuestionBank = async (req, res) => {
    try {
        const {type, title, score, grade, difficultyLevel, 
            topic, isMain, status, isPractice } = req.body;

        const main = (isMain === 'false' || isMain === 'undefined' || isMain === false) ? false : true;
        const practice = (isPractice === 'false' || isPractice === 'undefined' || isPractice === false) ? false : true;
        let image;
        if (req.files['questionImage']) {
            image = await getAwsS3Url(req.files['questionImage'][0]);
        }

        const bank = new QuestionBank({
            type, title, score, grade, difficultyLevel, image,
            topic, isMain: main, status, isPractice: practice,
            createdBy: req.user._id, lastmodifiedBy: req.user._id
         });
        await bank.save();
        res.status(201).json({status: 'success', data: bank});
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
};

exports.editQuestionBank = async (req, res) => {
    try {
        const quebankId = req.params.id;
        const updates = req.body;

        updates.isMain = (updates?.isMain === 'false' || updates?.isMain === 'undefined' || updates?.isMain === false) ? false : true;
        updates.practice = (updates?.practice === 'false' || updates?.practice === 'undefined' || updates?.practice === false) ? false : true;
        
        if (req.files['questionImage']) {
            updates.image = await getAwsS3Url(req.files['questionImage'][0]);
        }
        const updatedBank = await QuestionBank.findByIdAndUpdate(new ObjectId(quebankId), updates, { new: true });
        if (!updatedBank) {
            return res.status(404).json({ message: 'Question bank not found' });
        }

        res.status(201).json({status: "success", data: updatedBank });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Assuming this is your controller function
exports.addOptionToQuestionBank = async (req, res) => {
    try {
        const quebankId = req.params.id;
        const { title, isCorrect } = req.body;

        let imageUrl = null;
        const correct = (isCorrect === 'false' || isCorrect === 'undefined' || isCorrect === false) ? false : true;

        // Handle question image upload
        if (req.files['optionImage']) {
            imageUrl = await getAwsS3Url(req.files['optionImage'][0]);
        }

        const newOption = {
            title,
            isCorrect: correct,
            image: imageUrl,
        };

        const bank = await QuestionBank.findById(new ObjectId(quebankId));
        if (!bank) {
            return res.status(404).json({ message: 'Question bank not found' });
        }
        bank.options.push(newOption);
        await bank.save();

        res.status(201).json({status: 'success', data: bank });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.editOptionInQuestionBank = async (req, res) => {
    try {
        const { quebankId, optionId } = req.params;
        const updates = req.body; // This will contain only the fields to be updated

        const bank = await QuestionBank.findById(new ObjectId(quebankId));
        if (!bank) {
            return res.status(404).json({ message: 'Question bank not found' });
        }

        const optionIndex = bank.options.findIndex(q => q._id?.toString() === optionId?.toString());
        if (optionIndex === -1) {
            return res.status(404).json({ message: 'Question not found' });
        }

        let option = bank.options[optionIndex];

        // Update text fields if provided
        if (updates.title) option.title = updates.title;
        option.isCorrect = (updates.isCorrect === 'false' || updates.isCorrect === 'undefined' || updates.isCorrect === false) ? false : true;

        // Handle option image upload if a new file is provided
        if (req.files['optionImage']) {
            option.image = await getAwsS3Url(req.files['optionImage'][0]);
        }

        await bank.save();
        res.status(201).json({status: 'success', data: bank });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteOptionInQuestionBank = async (req, res) => {
    try {
        const { quebankId, optionId } = req.params;

        const bank = await QuestionBank.findById(new ObjectId(quebankId));
        if (!bank) {
            return res.status(404).json({ message: 'Question bank not found' });
        }

        const update = await QuestionBank.findByIdAndUpdate(new ObjectId(quebankId), {
            $pull: {
                options: { _id: new ObjectId(optionId) } // Remove the specified optionId from the 'options' array
            }
        }, { new: true });

        res.status(201).json({status: 'success', data: update });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getOptionOfQuestionBank = async (req, res) => {
    try {
        const quebankId = req.params.id;

        const bank = await QuestionBank.findById(new ObjectId(quebankId))
        .select('options')
        if (!bank) {
            return res.status(404).json({ message: 'Question bank not found' });
        }

        res.status(201).json({status: 'success', data: bank });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllActiveQuestions = async (req, res) => {
    try {
        const count = await QuestionBank.countDocuments({status: "Inactive"});
        const quizzes = await QuestionBank.find({status: "Active"}).populate('grade', 'grade');
        res.status(200).json({status:'success', data: quizzes, count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllInactiveQuestions = async (req, res) => {
    try {
        const count = await QuestionBank.countDocuments({status: "Inactive"});
        const quizzes = await QuestionBank.find({status: "Inactive"}).populate('grade', 'grade');
        res.status(200).json({status:'success', data: quizzes, count: count});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
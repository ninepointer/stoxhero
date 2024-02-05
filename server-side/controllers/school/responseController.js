const Response = require('../../models/School/Response'); // Adjust the path as per your project structure
const {ObjectId} = require('mongodb');
const User = require('../../models/User/userDetailSchema');
const Quiz = require('../../models/School/Quiz'); // Adjust the path as per your project structure


exports.initiatQuiz = async (req, res) => {
    try {
        const userId = req.user._id;
        const quizId = req.params.id;

        const findResponse = await Response.findOne({student: new ObjectId(userId), quiz: new ObjectId(quizId)});

        if(findResponse){
            return res.status(400).json({ message: "user response exist!" });
        }
        const createResponse = await Response.create({
            student: userId, initiatedOn: new Date(), quiz: quizId,
            createdBy: userId, lastmodifiedBy: userId
        })

        res.status(201).json({status: 'success', data: createResponse});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.insertResponse = async (req, res) => {
    try {
        const userId = req.user._id;
        const quizId = req.params.id;
        const {questionId, optionId}  = req.body;

        const getScore = await getCorrectAnswer(quizId, questionId, optionId);

        const score = await getCorrectAnswer(quizId, questionId, optionId) ? getScore : 0;

        const userQuiz = await Response.findOne({student: new ObjectId(userId), quiz: new ObjectId(quizId)});
        const findQue = userQuiz?.responses?.some((elem)=>elem.questionId?.toString() === questionId?.toString())
        if(!findQue){
            const updateResponse = await Response.findByIdAndUpdate(userQuiz?._id, {
                $push: {
                    responses: {
                        questionId,
                        responses: [optionId],
                        responseScore: score
                    }
                }
            })

            res.status(201).json({status: 'success', data: updateResponse});
        }

        if (findQue) {
            // If question already exists in responses, update the responses array
            const updatedResponse = await Response.findOneAndUpdate(
                {
                    _id: userQuiz._id,
                    'responses.questionId': new ObjectId(questionId)
                },
                {
                    $push: {
                        'responses.$.responses': new ObjectId(optionId),
                    }
                },
                { new: true }
            );

            res.status(200).json({ status: 'success', data: updatedResponse });
        }


        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getCorrectAnswer = async (req, res) => {
    try {
        const quizId = req.params.id;
        const {questionId, optionId}  = req.params;

        const quiz = await Quiz.findById(new ObjectId(quizId));
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        const question = quiz.questions.find(elem => elem?._id?.toString() === questionId?.toString());
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const option = question.options.find(subelem => subelem?._id?.toString() === optionId?.toString());
        if (option && option.isCorrect) {
            return res.status(201).json({ status: 'success', data: true });
        }

        return res.status(200).json({ status: 'success', data: false });
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.submitQuiz = async (req, res) => {
    try {
        const userId = req.user._id;
        const quizId = req.params.id;
        const {submittedBy} = req.body;

        const response = await Response.findOne({student: new ObjectId(userId), quiz: new ObjectId(quizId)});

        if(!response){
            return res.status(400).json({ message: "user response not exist!" });
        }

        const totalScore = response.responses.reduce((total, elem)=>{
            return total + elem.responseScore;
        }, 0);

        response.studentScore = totalScore;
        response.submittedOn = new Date();
        response.submittedBy = submittedBy;

        const newResponse = await response.save({new: true})

        res.status(201).json({status: 'success', data: newResponse});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getCorrectAnswer = async (quizId, questionId, optionId) => {
    try {

        const quiz = await Quiz.findById(new ObjectId(quizId));
        if (!quiz) {
            return false;
        }

        const question = quiz.questions.find(elem => elem?._id?.toString() === questionId?.toString());
        if (!question) {
            return false;
        }

        const option = question.options.find(subelem => subelem?._id?.toString() === optionId?.toString());
        if (option && option.isCorrect) {
            return question?.score
        }

        return false;
        
    } catch (error) {
        console.log(error);
    }
};

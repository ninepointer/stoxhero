const Response = require('../../models/School/Response'); // Adjust the path as per your project structure
const {ObjectId} = require('mongodb');
const User = require('../../models/User/userDetailSchema');
const Quiz = require('../../models/School/Quiz'); // Adjust the path as per your project structure
const mongoose = require('mongoose');

exports.initiatQuiz = async (req, res) => {
    try {
        const userId = req.user._id;
        const quizId = req.params.id;

        const findResponse = await Response.findOne({student: new ObjectId(userId), quiz: new ObjectId(quizId)});

        if(findResponse){
            return res.status(400).json({ message: "user response exist!" });
        }

        const quiz = await Quiz.findOne({_id: new ObjectId(quizId)}).populate('questions', 'difficultyLevel type');

        const que = await selectRandomQuestions(quiz.userQuestionnaire, quiz.permissibleSet, quiz.grade, quiz.questions);

        if(!que){
            return res.status(400).json({ message: "something went wrong" });
        }

        // console.log('que', que)
        const createResponse = await Response.create({
            student: userId, initiatedOn: new Date(), quiz: quizId,
            createdBy: userId, lastmodifiedBy: userId, questions: que
        })

        // const response = await Response.findOne({student: new ObjectId(userId), quiz: new ObjectId(quizId)})
        // .populate('questions', 'title type image score difficultyLevel topic')
        // .select('-initiatedOn -createdBy -lastmodifiedBy')


        res.status(201).json({status: 'success', data: createResponse});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getQuestions = async (req, res) => {
    try {
        const userId = req.user._id;
        const quizId = req.params.id;

        if(!mongoose.Types.ObjectId(quizId)){
            res.status(400).json({ message: 'Quiz is not valid!' });
        }

        const response = await Response.findOne({student: new ObjectId(userId), quiz: new ObjectId(quizId)})
        .populate('questions', 'title type image score difficultyLevel topic options')
        .select('-initiatedOn -createdBy -lastmodifiedBy -createdOn -lastmodifiedOn');

        const newData = JSON.parse(JSON.stringify(response));
        newData.questions.forEach(question => {
            if (question.options) {
                question.options.forEach(option => {
                    delete option.isCorrect;
                });
            }
        });

        if(!response){
            res.status(400).json({ message: 'No data found!' });
        }

        res.status(201).json({status: 'success', data: newData});
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

const calculateDetailedCounts = (total, details) => {
    // console.log('total and details', total, details)
    return {

        multiCorrect: Math.round(total * Number(details.multiCorrectPercentage) / 100),
        imageSingleCorrect: Math.round(total * Number(details.imageSingleCorrectPercentage) / 100),
        imageMultiCorrect: Math.round(total * Number(details.imageMultiCorrectPercentage) / 100),
        singleCorrect: total - (Math.round(total * Number(details.multiCorrectPercentage) / 100)) - (Math.round(total * Number(details.imageSingleCorrectPercentage) / 100)) - (Math.round(total * Number(details.imageMultiCorrectPercentage) / 100))

    };
};
// Main function to select random questions based on detailed criteria
const selectRandomQuestions = async (questionnaire, permissibleSet, grade, questionsArr) => {
    const quizQuestionnaire = questionnaire || 10; // Default to 10 questions if not specified
    const defaultCriteria = {
        Easy: { totalPercentage: permissibleSet?.easy, singleCorrectPercentage: permissibleSet?.singleCorrect, multiCorrectPercentage: permissibleSet?.multiCorrect, imageSingleCorrectPercentage: permissibleSet?.imageSingleCorrect, imageMultiCorrectPercentage: permissibleSet?.imageMultiCorrect },
        Medium: { totalPercentage: permissibleSet?.medium, singleCorrectPercentage: permissibleSet?.singleCorrect, multiCorrectPercentage: permissibleSet?.multiCorrect, imageSingleCorrectPercentage: permissibleSet?.imageSingleCorrect, imageMultiCorrectPercentage: permissibleSet?.imageMultiCorrect },
        Difficult: { totalPercentage: permissibleSet?.difficult, singleCorrectPercentage: permissibleSet?.singleCorrect, multiCorrectPercentage: permissibleSet?.multiCorrect, imageSingleCorrectPercentage: permissibleSet?.imageSingleCorrect, imageMultiCorrectPercentage: permissibleSet?.imageMultiCorrect },
    };
    const criteria = defaultCriteria;

    // Calculating the total number of questions for each difficulty level based on the total percentage
    const totalQuestionsByDifficulty = {
        Medium: Math.round(quizQuestionnaire * criteria.Medium.totalPercentage / 100),
        Difficult: Math.round(quizQuestionnaire * criteria.Difficult.totalPercentage / 100),
        Easy: quizQuestionnaire - Math.round(quizQuestionnaire * criteria.Difficult.totalPercentage / 100) - Math.round(quizQuestionnaire * criteria.Medium.totalPercentage / 100),
    };

    // console.log('totalQuestionsByDifficulty', totalQuestionsByDifficulty)

    try {
        let questions = [];
        for (const [difficulty, details] of Object.entries(criteria)) {
            const totalQuestionsForLevel = totalQuestionsByDifficulty[difficulty];
            // console.log('totalQuestionsForLevel', totalQuestionsForLevel)
            if (totalQuestionsForLevel > 0) {
                const counts = calculateDetailedCounts(totalQuestionsForLevel, details);
                // console.log('counts', counts)
                const typesAndCounts = [
                    { type: 'Single Correct', count: counts.singleCorrect },
                    { type: 'Multiple Correct', count: counts.multiCorrect },
                    { type: 'Image Single Correct', count: counts.imageSingleCorrect },
                    { type: 'Image Multiple Correct', count: counts.imageMultiCorrect },
                ];

                // console.log('typesAndCounts', typesAndCounts)

                for (const { type, count } of typesAndCounts) {
                    if (count > 0) {
                    

                        // console.log('type, count', type, count)

                        const filteredQue = questionsArr.filter((elem)=>{
                            return ((elem.difficultyLevel === difficulty) && (elem.type === type))
                        })

                        // console.log('filteredQue', filteredQue.length, questionsArr.length)

                        const len = filteredQue.length;
                        const num = count;

                        // Generate random indices
                        const randomIndices = [];
                        while (randomIndices.length < num) {
                            const randomIndex = Math.floor(Math.random() * len);
                            if (!randomIndices.includes(randomIndex)) {
                                randomIndices.push(randomIndex);
                            }
                        }

                        // console.log('randomIndices', randomIndices)

                        const slicedArray = randomIndices.map(index => filteredQue[index]);
                        // console.log('slicedArray', slicedArray, randomIndices)
                        questions = questions.concat(slicedArray.map(elem=>elem._id));
                    }
                }
            }
        }

        if (questions.length < quizQuestionnaire) {
            return false
            // Handle scenario where not enough questions are found
        }

        return questions;
    } catch (error) {
        console.log(error);
    }
};

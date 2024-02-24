const Response = require('../../models/School/Response'); // Adjust the path as per your project structure
const {ObjectId} = require('mongodb');
const User = require('../../models/User/userDetailSchema');
const Quiz = require('../../models/School/Quiz'); // Adjust the path as per your project structure
const mongoose = require('mongoose');

exports.initiatQuiz = async (req, res) => {
    try {
        const userId = req.user._id;
        const quizId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(quizId)) {
            return res.status(400).json({ message: 'Quiz id is not valid!' });
        }

        const findResponse = await Response.findOne({student: new ObjectId(userId), quiz: new ObjectId(quizId)});

        if(findResponse){
            return res.status(400).json({ message: "user response exist!" });
        }

        const quiz = await Quiz.findOne({_id: new ObjectId(quizId)}).populate('questions', 'difficultyLevel type');

        const que = await selectRandomQuestions(quiz.userQuestionnaire, quiz.permissibleSet, quiz.grade, quiz.questions);

        if(!que){
            return res.status(400).json({ message: "something went wrong" });
        }

        const createResponse = await Response.create({
            student: userId, initiatedOn: new Date(), quiz: quizId,
            createdBy: userId, lastmodifiedBy: userId, questions: que
        })

        res.status(201).json({status: 'success', data: createResponse});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getQuestions = async (req, res) => {
    try {
        const userId = req.user._id;
        const quizId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(quizId)) {
            return res.status(400).json({ message: 'Quiz id is not valid!' });
        }

        const response = await Response.findOne({student: new ObjectId(userId), quiz: new ObjectId(quizId)})
        .populate('questions', 'title type image score difficultyLevel topic options')
        .select('quiz questions responses');

        const newData = JSON.parse(JSON.stringify(response));
        newData.questions.forEach(question => {
            if (question.options) {
                question.options.forEach(option => {
                    delete option.isCorrect;
                });
            }
        });

        newData.responses.forEach(response => {
            delete response.responseScore;
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

        if(!quizId || !questionId || !optionId.length){
            return res.status(400).json({ message: 'Request is not valid!' });
        }

        if (!mongoose.Types.ObjectId.isValid(quizId)) {
            return res.status(400).json({ message: 'Quiz id is not valid!' });
        }

        if (!mongoose.Types.ObjectId.isValid(questionId)) {
            return res.status(400).json({ message: 'Question id is not valid!' });
        }

        for(let elem of optionId){
            if (!mongoose.Types.ObjectId.isValid(elem)) {
                return res.status(400).json({ message: 'Option id is not valid!' });
            }
        }

        const score = await getCorrectAnswer(quizId, questionId, optionId) || 0;

        const userQuiz = await Response.findOne({student: new ObjectId(userId), quiz: new ObjectId(quizId)});

        let updateResponse = await Response.findOneAndUpdate(
            {
                _id: userQuiz?._id,
                'responses.questionId': questionId
            },
            {
                $set: {
                    'responses.$.responses': optionId,
                    'responses.$.responseScore': score
                }
            },
            {
                new: true,
                select: 'quiz questions responses'
            }
        );
        
        if (!updateResponse) {
            // If questionId does not exist, push a new element
            updateResponse = await Response.findByIdAndUpdate(
                userQuiz?._id,
                {
                    $push: {
                        responses: {
                            questionId,
                            responses: optionId,
                            responseScore: score
                        }
                    }
                },
                {
                    new: true,
                    select: 'quiz questions responses' // Specify the fields you want to include
                }
            );            
        }

        const newData = JSON.parse(JSON.stringify(updateResponse));
        newData.questions.forEach(question => {
            if (question.options) {
                question.options.forEach(option => {
                    delete option.isCorrect;
                });
            }
        });

        newData.responses.forEach(response => {
            delete response.responseScore;
        });
        

        res.status(201).json({status: 'success', data: newData});

    } catch (error) {
        console.log(error)
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
        const {student} = req.body;

        if (!mongoose.Types.ObjectId.isValid(quizId)) {
            return res.status(400).json({ message: 'Quiz id is not valid!' });
        }

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
        const quiz = await Quiz.findById(new ObjectId(quizId)).populate('questions', 'options score')
        if (!quiz) {
            return false;
        }

        const question = quiz.questions.find(elem => elem?._id?.toString() === questionId?.toString());
        if (!question) {
            return false;
        }

        const option = question.options.find(subelem => optionId.includes(subelem?._id?.toString()));
        if (option && option.isCorrect) {
            return question?.score
        }

        return false;
        
    } catch (error) {
        console.log(error);
    }
};

const calculateDetailedCounts = (total, details) => {
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

    try {
        let questions = [];
        for (const [difficulty, details] of Object.entries(criteria)) {
            const totalQuestionsForLevel = totalQuestionsByDifficulty[difficulty];
            if (totalQuestionsForLevel > 0) {
                const counts = calculateDetailedCounts(totalQuestionsForLevel, details);
                const typesAndCounts = [
                    { type: 'Single Correct', count: counts.singleCorrect },
                    { type: 'Multiple Correct', count: counts.multiCorrect },
                    { type: 'Image Single Correct', count: counts.imageSingleCorrect },
                    { type: 'Image Multiple Correct', count: counts.imageMultiCorrect },
                ];

                for (const { type, count } of typesAndCounts) {
                    if (count > 0) {
                    
                        const filteredQue = questionsArr.filter((elem)=>{
                            return ((elem.difficultyLevel === difficulty) && (elem.type === type))
                        })

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

                        const slicedArray = randomIndices.map(index => filteredQue[index]);
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

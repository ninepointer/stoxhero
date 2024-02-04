const express = require('express');
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');
const quizController = require('../../controllers/school/quizController');
const router = express.Router();

const multer = require('multer');

const storage = multer.memoryStorage(); // Using memory storage

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post(
    '/', Authenticate, restrictTo('Admin', 'SuperAdmin'),
    upload.fields([{ name: 'quizImage', maxCount: 1 }]),
    quizController.createQuiz
);

router.get(
    '/active', Authenticate, restrictTo('Admin', 'SuperAdmin'),
    quizController.getActiveQuizForAdmin
);

router.get(
    '/user', Authenticate,
    quizController.getAllQuizzesForUser
);

router.get(
    '/user/my', Authenticate,
    quizController.getMyQuizzesForUser
);

router.get(
    '/:id', 
    quizController.getQuizForUser
);

router.patch(
    '/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'),
    upload.fields([{ name: 'quizImage', maxCount: 1 }]),
    quizController.editQuiz
);

router.get(
    '/:quizId/question', Authenticate, restrictTo('Admin', 'SuperAdmin'),
    upload.fields([{ name: 'questionImage', maxCount: 1 }]), // Adjust maxCount as needed
    quizController.getQuizQuestion
);

router.patch(
    '/:quizId/question', Authenticate, restrictTo('Admin', 'SuperAdmin'),
    upload.fields([{ name: 'questionImage', maxCount: 1 }]), // Adjust maxCount as needed
    quizController.addQuestionToQuiz
);

router.patch(
    '/:quizId/question/:questionId',Authenticate, restrictTo('Admin', 'SuperAdmin'),
    upload.fields([{ name: 'questionImage', maxCount: 1 }, { name: 'optionImages', maxCount: 10 }]),
    quizController.editQuestionInQuiz
);

router.patch(
    '/:quizId/option/:questionId',Authenticate, restrictTo('Admin', 'SuperAdmin'),
    upload.fields([ { name: 'optionImage', maxCount: 10 }]),
    quizController.addOptionToQuiz
);

router.patch(
    '/user/registration/:id', Authenticate,
    quizController.registration
);

router.patch(
    '/:quizId/option/:questionId/:optionId',Authenticate, restrictTo('Admin', 'SuperAdmin'),
    upload.fields([ { name: 'optionImage', maxCount: 10 }]),
    quizController.editOptionInQuiz
);


module.exports = router;
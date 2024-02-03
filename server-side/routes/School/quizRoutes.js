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



router.patch(
    '/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'),
    upload.fields([{ name: 'quizImage', maxCount: 1 }]),
    quizController.editQuiz
);

router.post(
    '/:quizId/question', Authenticate, restrictTo('Admin', 'SuperAdmin'),
    upload.fields([{ name: 'questionImage', maxCount: 1 }, { name: 'optionImages', maxCount: 10 }]), // Adjust maxCount as needed
    quizController.addQuestionToQuiz
);
router.patch(
    '/:quizId/question/:questionId',Authenticate, restrictTo('Admin', 'SuperAdmin'),
    upload.fields([{ name: 'questionImage', maxCount: 1 }, { name: 'optionImages', maxCount: 10 }]),
    quizController.editQuestionInQuiz
);

router.patch(
    '/user/registration/:id', Authenticate,
    quizController.registration
);


module.exports = router;
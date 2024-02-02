const express = require('express');
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');
const {createPost, getPost, getPosts} = require('../../controllers/school/quizController');
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
    '/quiz/:quizId/question', Authenticate, restrictTo('Admin', 'SuperAdmin'),
    upload.fields([{ name: 'questionImage', maxCount: 1 }, { name: 'optionImages', maxCount: 10 }]), // Adjust maxCount as needed
    quizController.addQuestionToQuiz
);
router.patch(
    '/quiz/:quizId/question/:questionId',Authenticate, restrictTo('Admin', 'SuperAdmin'),
    upload.fields([{ name: 'questionImage', maxCount: 1 }, { name: 'optionImages', maxCount: 10 }]),
    quizController.editQuestionInQuiz
);


module.exports = router;
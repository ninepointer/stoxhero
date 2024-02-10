const express = require('express');
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');
const queController = require('../../controllers/questionBank/queBank');
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
    upload.fields([{ name: 'questionImage', maxCount: 1 }]),
    queController.createQuestionBank
);

router.get(
    '/active', Authenticate, restrictTo('Admin', 'SuperAdmin'),
    queController.getAllActiveQuestions
);

router.get(
    '/:id/option', Authenticate, restrictTo('Admin', 'SuperAdmin'),
    queController.getOptionOfQuestionBank
);

// router.get(
//     '/user/my', Authenticate,
//     queController.getMyQuizzesForUser
// );

// router.get(
//     '/:id', Authenticate,
//     queController.getQuizForUser
// );

// router.get(
//     '/user/slots/:id', Authenticate,
//     queController.getSlot
// );

// router.get(
//     '/:quizId/question', Authenticate, restrictTo('Admin', 'SuperAdmin'),
//     upload.fields([{ name: 'questionImage', maxCount: 1 }]), // Adjust maxCount as needed
//     queController.getQuizQuestion
// );

router.patch(
    '/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'),
    upload.fields([{ name: 'questionImage', maxCount: 1 }]),
    queController.editQuestionBank
);

router.patch(
    '/:id/option', Authenticate, restrictTo('Admin', 'SuperAdmin'),
    upload.fields([{ name: 'optionImage', maxCount: 1 }]), // Adjust maxCount as needed
    queController.addOptionToQuestionBank
);

router.patch(
    '/:quebankId/option/:optionId',Authenticate, restrictTo('Admin', 'SuperAdmin'),
    upload.fields([{ name: 'optionImage', maxCount: 1 }, { name: 'optionImages', maxCount: 10 }]),
    queController.editOptionInQuestionBank
);

router.delete(
    '/:quebankId/option/:optionId',Authenticate, restrictTo('Admin', 'SuperAdmin'),
    queController.deleteOptionInQuestionBank
);



module.exports = router;
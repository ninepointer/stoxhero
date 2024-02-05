const express = require('express');
const Authenticate = require('../../authentication/authentication');
const responseController = require('../../controllers/school/responseController');
const router = express.Router();

router.post('/:id', Authenticate, responseController.initiatQuiz);
router.patch('/submit/:id', Authenticate, responseController.submitQuiz);
router.patch('/insertresponse/:id', Authenticate, responseController.insertResponse);
router.get('/correctanswer/:id/:questionId/:optionId', Authenticate, responseController.getCorrectAnswer );


module.exports = router;
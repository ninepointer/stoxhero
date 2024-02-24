const express = require('express');
const {SchoolAuthenticate} = require('../../authentication/schoolAuthentication');
const schoolController = require('../../controllers/school/schoolOnboarding');
const router = express.Router();


router.get('/total', SchoolAuthenticate, schoolController.getTotalStudents);
router.get('/newjoineefulllist', SchoolAuthenticate, schoolController.getTotalStudentsFullList);
router.get('/quiz/:quizId', SchoolAuthenticate, schoolController.getStudentsQuizWise);
router.get('/quizregisteredfulllist/:quizId', SchoolAuthenticate, schoolController.getStudentsQuizWiseFullList);

module.exports = router;
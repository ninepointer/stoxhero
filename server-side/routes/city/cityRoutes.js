const express = require('express');
const cityController = require("../../controllers/cityController");
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');
const router = express.Router();

router.post('/', Authenticate, restrictTo('Admin', 'Super Admin'), cityController.createCity);
router.get('/', cityController.getAllCities);
router.patch('/:id', Authenticate, restrictTo('Admin', 'Super Admin'), cityController.editCity);
router.get('/active', cityController.getActiveCities);
router.get('/:id', Authenticate, restrictTo('Admin', 'Super Admin'), cityController.getCityById);

module.exports = router;

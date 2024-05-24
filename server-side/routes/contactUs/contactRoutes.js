const express = require('express');
const {createContact, getContact, getContacts} = require('../../controllers/contactInfoController');
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');
const router = express.Router();

router.post('/', createContact);
router.get('/', Authenticate, restrictTo('Admin', 'Super Admin'), getContacts);
router.get('/:id', Authenticate, restrictTo('Admin', 'Super Admin'), getContact);

module.exports = router;

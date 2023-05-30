const express = require('express');
const {createContact, getContact, getContacts} = require('../../controllers/contactInfoController');
const router = express.Router();

router.post('/', createContact);
router.get('/', getContacts);
router.get('/:id', getContact);

module.exports = router;

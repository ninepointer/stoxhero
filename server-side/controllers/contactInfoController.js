const Contact = require('../models/contactus/contactInfo');

// Create a new contact
exports.createContact = async (req, res) => {
    const {first_name, last_name, email, phone, message } = req.body;
    try {
        const contact = await Contact.create({first_name: first_name.trim(), last_name: last_name.trim(), email:email.trim(), phone:phone.trim(), message});
        res.status(201).json({status:'success', message:'Submitted'});
    } catch (error) {
        console.log('error', error);
        res.status(500).json({status:'error', message:'Something went wrong.'});
    }
};

// Get all contacts
exports.getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({});
        res.status(201).json({status:'success', data:contacts});
    } catch (error) {
        res.status(500).json({status:'error', message:'Something went wrong.'});
    }
};

// Get contact by id
exports.getContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({status:'error', message:'No contact info found.'});
        }
        res.status(200).json({status:'success', data:contact});
    } catch (error) {
        res.status(500).json({status:'error', message:'Something went wrong.'});
    }
};

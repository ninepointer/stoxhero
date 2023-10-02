const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const PageView = require('../../models/pageViews/pageView');


// Create a new contact
exports.createPageView = async (req, res) => {
    console.log(req.params)
    const page = req.params.page;
    const pageLink = req.params.pageLink;
    const userId = req.user._id;
    try {
        const pageView = await PageView.create({userId: userId, lastModifiedBy: userId, createdBy: userId, page: page, pageLink: pageLink});
        res.status(201).json({status:'success', message:'PageView Captured Successfully'});
    } catch (error) {
        console.log('error', error);
        res.status(500).json({status:'error', message:'Something went wrong.'});
    }
};

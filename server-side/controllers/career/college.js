const College = require("../../models/Careers/collageSchema");
// const User = require("../../models/User/userDetailSchema")

exports.createCollege = async(req, res, next)=>{
    console.log(req.body) // batchID
    const{collegeName, zone } = req.body;

    if(await College.findOne({collegeName: collegeName.trim()})) return res.status(400).json({message:'This college exists.'});

    const college = await College.create({collegeName: collegeName.trim(), zone, createdBy: req.user._id, lastModifiedBy: req.user._id});
    
    res.status(201).json({status: 'success', message: 'College successfully created.', data: college});

}

exports.getColleges = async(req, res, next)=>{
    try{
        const colleges = await College.find().sort({collegeName:1});
        res.status(200).json({status: 'success', data: colleges, results: colleges.length});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
};

exports.getCollege = async(req, res, next) => {
    const id = req.params.id;

    try {
        const college = await College.findById(id);
        res.status(200).json({status: 'success', data: college});
    } catch (e) {
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
}

exports.editCollege = async(req, res, next) => {
    const id = req.params.id;

    console.log("id is ,", id)

    const college = await College.findOneAndUpdate({_id : id}, {
        $set:{
            collegeName: req.body.collegeName,
            zone: req.body.zone,
            lastModifiedBy: req.user._id,
            lastModifiedOn: new Date()
        }
    }, {new: true})

    res.status(200).json({message: 'Successfully edited college.', data: college});
}

exports.deleteCollege = async(req, res, next) => {
    const id = req.params.id;

    console.log("id is ,", id)

    const college = await College.findByIdAndUpdate(id, { isDeleted: true })

    res.status(200).json({message: 'Successfully deleted college.', data: college});
}

exports.getEastZoneColleges = async(req, res, next)=>{
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10
    const count = await College.countDocuments({zone:'East'})
    try{
        const eastzonecolleges = await College.find({zone:'East'})
        .populate('createdBy','first_name last_name')
        .sort({collegeName: 1})
        .skip(skip)
        .limit(limit);
        res.status(201).json({status: 'success', data: eastzonecolleges, count: count});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
};

exports.getCollegeName = async(req, res, next)=>{
    try{
        const collegeName = await College.find().select('collegeName _id')
        res.status(201).json({status: 'success', data: collegeName, count: collegeName.length});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
};

exports.getNorthZoneColleges = async(req, res, next)=>{
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10
    const count = await College.countDocuments({zone:'North', isDeleted:'false'})
    try{
        const northzonecolleges = await College.find({zone:'North', isDeleted:'false'})
        .populate('createdBy','first_name last_name')
        .sort({collegeName: 1})
        .skip(skip)
        .limit(limit);
        res.status(201).json({status: 'success', data: northzonecolleges, count: count});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
};

exports.getSouthZoneColleges = async(req, res, next)=>{
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10
    const count = await College.countDocuments({zone:'South', isDeleted:'false'})
    try{
        const southzonecolleges = await College.find({zone:'South', isDeleted:'false'})
        .populate('createdBy','first_name last_name')
        .sort({collegeName: 1})
        .skip(skip)
        .limit(limit);
        res.status(201).json({status: 'success', data: southzonecolleges, count: count});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
};

exports.getWestZoneColleges = async(req, res, next)=>{
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10
    const count = await College.countDocuments({zone:'West', isDeleted:'false'})
    try{
        const westzonecolleges = await College.find({zone:'West', isDeleted:'false'})
        .populate('createdBy','first_name last_name')
        .sort({collegeName: 1})
        .skip(skip)
        .limit(limit);
        res.status(201).json({status: 'success', data: westzonecolleges, count: count});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
};

exports.getCentralZoneColleges = async(req, res, next)=>{
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10
    const count = await College.countDocuments({zone:'Central', isDeleted:'false'})
    try{
        const centralzonecolleges = await College.find({zone:'Central', isDeleted:'false'})
        .populate('createdBy','first_name last_name')
        .sort({collegeName: 1})
        .skip(skip)
        .limit(limit);
        res.status(201).json({status: 'success', data: centralzonecolleges, count: count});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
};


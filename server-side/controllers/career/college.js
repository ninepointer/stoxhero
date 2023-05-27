const College = require("../../models/Careers/collageSchema");
// const User = require("../../models/User/userDetailSchema")

exports.createCollege = async(req, res, next)=>{
    console.log(req.body) // batchID
    const{collegeName, zone } = req.body;

    if(await College.findOne({collegeName})) return res.status(400).json({message:'This college exists.'});

    const college = await College.create({collegeName, zone, createdBy: req.user._id, lastModifiedBy: req.user._id});
    
    res.status(201).json({status: 'success', message: 'College successfully created.', data: college});

}

exports.getColleges = async(req, res, next)=>{
    try{
        const colleges = await College.find();
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

    res.status(200).json({message: 'Successfully edited group discussion.', data: college});
}

exports.deleteCollege = async(req, res, next) => {
    const id = req.params.id;

    const result = await College.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
    return res.status(404).json({ message: "College not found" });
    }

    res.status(200).json({ message: "College deleted successfully" });
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

exports.getNorthZoneColleges = async(req, res, next)=>{
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10
    const count = await College.countDocuments({zone:'North'})
    try{
        const northzonecolleges = await College.find({zone:'North'})
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
    const count = await College.countDocuments({zone:'South'})
    try{
        const southzonecolleges = await College.find({zone:'South'})
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
    const count = await College.countDocuments({zone:'West'})
    try{
        const westzonecolleges = await College.find({zone:'West'})
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
    const count = await College.countDocuments({zone:'Central'})
    try{
        const centralzonecolleges = await College.find({zone:'Central'})
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


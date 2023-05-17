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
        const college = await College.find();
        res.status(201).json({status: 'success', data: college, results: college.length});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
};

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
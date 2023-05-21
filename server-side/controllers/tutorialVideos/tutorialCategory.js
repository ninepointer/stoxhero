const tutorialCategory = require("../../models/tutorialVideos/tutorialVideoCategory");
const user = require("../../models/User/userDetailSchema")

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el) && obj[el] !== null && obj[el] !== undefined && obj[el] !== '') {
        newObj[el] = obj[el];
      }
    });
    return newObj;
};

exports.createTutorialCategory = async(req, res, next)=>{
    console.log(req.body) 
    const{categoryName, description, status } = req.body;

    if(await tutorialCategory.findOne({categoryName})) return res.status(400).json({message:'This category already exists.'});

    const videoCategory = await tutorialCategory.create({categoryName, description, status, createdBy: req.user._id, lastModifiedBy: req.user._id});
    
    res.status(201).json({status: 'success', message: 'Category successfully created.', data: videoCategory});

}

exports.getTutorialCategories = async(req, res, next)=>{
    try{
        const videoCategory = await tutorialCategory.find();
        res.status(200).json({status: 'success', data: videoCategory, results: videoCategory.length});    
    }catch(e){
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
};

exports.getTutorialCategory = async(req, res, next) => {
    const id = req.params.id;

    try {
        const videoCategory = await tutorialCategory.findById(id);
        res.status(200).json({status: 'success', data: videoCategory});
    } catch (e) {
        console.log(e);
        res.status(500).json({status: 'error', message: 'Something went wrong'});
    }
}

exports.editTutorialCategory = async(req, res, next) => {
    const id = req.params.id;

    console.log("id is ,", id)
    const videoCategory = await tutorialCategory.findById(id);

    const filteredBody = filterObj(req.body, "categoryName", "status", "description");
    if(req.body.categoryVideos)filteredBody.categoryVideos=[...videoCategory.categoryVideos,
        {title:req.body.categoryVideos.title,
        videoId:req.body.categoryVideos.videoId,}]
    filteredBody.lastModifiedBy = req.user._id;    

    console.log(filteredBody)
    const updated = await tutorialCategory.findByIdAndUpdate(id, filteredBody, { new: true });

    res.status(200).json({message: 'Successfully edited Tutorial Category.', data: updated});
}

exports.deleteTutorialCategory = async(req, res, next) => {
    const id = req.params.id;

    console.log("req ,", req.user)

    const videoCategory = await tutorialCategory.findOneAndUpdate({_id : id}, {
        $set:{
            isDeleted: true,
            // lastModifiedBy: req.user._id,
            lastModifiedOn: new Date()
        }
    }, {new: true})
    console.log(videoCategory)
    res.status(200).json({message: 'Successfully deleted tutorial category.', data: videoCategory});
}
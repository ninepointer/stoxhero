const School = require('../../models/School/schoolOnboarding'); // Adjust the path as per your project structure
const AWS = require('aws-sdk');
const {ObjectId} = require('mongodb');
const sharp = require('sharp');

// Configure AWS
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// Function to upload a file to S3
const getAwsS3Url = async (file, type) => {
    if(file && type==='Image'){
        file.buffer = await sharp(file.buffer)
        .resize({ width: 512, height: 256 })
        .toBuffer();
    }

    if(file && type==='Logo'){
        file.buffer = await sharp(file.buffer)
        .resize({ width: 256, height: 256 })
        .toBuffer();
    }
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `school/${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
         // or another ACL according to your requirements
    };

    try {
        const uploadResult = await s3.upload(params).promise();
        return uploadResult.Location;
    } catch (error) {
        console.error(error);
        throw new Error('Error uploading file to S3');
    }
};

exports.createSchool = async (req, res) => {
    try {
        const {name, principalName, address, email, highestGrade,
            affiliation, affiliationNumber, status, website, city, 
            mobile, state} = req.body;

        let logo, image;
        if (req.files['logo']) {
            logo = await getAwsS3Url(req.files['logo'][0], 'Logo');
        }

        if (req.files['image']) {
            image = await getAwsS3Url(req.files['image'][0], 'Image');
        }

        const school = new School({
            name, principalName, address, email, highestGrade, role: "65cb483199608018ca427990",
            affiliation, affiliationNumber, status, website, city, 
            mobile, state, createdBy: req.user._id, logo, image, password: 'To Be Set'
         });
        await school.save({new : true});
        res.status(201).json({status: 'success', data: school});
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
};

exports.editSchool = async (req, res) => {
    try {
        const schoolId = req.params.id;
        const updates = req.body;
        
        if (req.files['image']) {
            updates.image = await getAwsS3Url(req.files['image'][0], 'Image');
        }
        if (req.files['logo']) {
            updates.logo = await getAwsS3Url(req.files['logo'][0], 'Logo');
        }
        const updatedData = await School.findByIdAndUpdate(new ObjectId(schoolId), updates, { new: true });
        if (!updatedData) {
            return res.status(404).json({ message: 'School not found' });
        }

        res.status(201).json({status: "success", data: updatedData });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllActiveSchool = async (req, res) => {
    try {
        const count = await School.countDocuments({status: "Active"})
        const school = await School.find({status: "Active"}).populate('city', 'name').populate('highestGrade', 'grade');
        res.status(201).json({status: 'success', data: school, count: count  });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllInactiveSchool = async (req, res) => {
    try {
        const count = await School.countDocuments({status: "Inactive"})
        const school = await School.find({status: "Inactive"}).populate('city', 'name').populate('highestGrade', 'grade');
        res.status(201).json({status: 'success', data: school, count: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllDraftSchool = async (req, res) => {
    try {
        const count = await School.countDocuments({status: "Draft"})
        const school = await School.find({status: "Draft"}).populate('city', 'name').populate('highestGrade', 'grade');
        res.status(201).json({status: 'success', data: school, count: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getSchoolById = async (req, res) => {
    try {
        const schoolId = req.params.id;
        const school = await School.findById(new ObjectId(schoolId));
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }
        res.status(201).json({status: 'success', data: school });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
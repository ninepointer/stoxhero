const School = require('../../models/School/schoolOnboarding'); // Adjust the path as per your project structure
const AWS = require('aws-sdk');
const {ObjectId} = require('mongodb');
const User = require('../../models/User/userDetailSchema');
const sharp = require('sharp');
const Quiz = require('../../models/School/Quiz');
const Grade = require('../../models/grade/grade');

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

        const gradeData = await Grade.find();
        // const highest = gradeData.filter(elem => elem._id?.toString() === highestGrade?.toString());
        // const grade = gradeData.map(elem => elem.grade);

        gradeData.sort((a, b) => {
            const gradeA = parseInt(a.grade);
            const gradeB = parseInt(b.grade);
            return gradeA - gradeB;
        });

        // const grade = gradeData.map(elem => {});
        const grade = gradeData.map((elem)=>{
            return {grade: elem?._id?.toString()}
        })
        console.log("grade", grade);
        const index = grade.findIndex(item => item.grade === highestGrade?.toString());
        const allGrades = grade.slice(0, index+1);
        console.log(allGrades);

        const school = new School({
            school_name: name, head_name: principalName, address, email, highestGrade, role: "65cb483199608018ca427990",
            affiliation, affiliationNumber, status, website, city, isOnboarding: true, grades: allGrades,
            mobile, state, createdBy: req.user._id, logo, image, password: 'StoxHero'
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

exports.getSchoolGrades = async (req, res) => {
    try {
        const schoolId = req.params.id;
        const school = await School.findById(new ObjectId(schoolId))
        .populate('grades.grade', 'grade')
        .select('grades')
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }
        res.status(201).json({status: 'success', data: school.grades });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//--------------For schools--------------

exports.getTotalStudents = async (req, res) => {
    try {
        const id = req.user._id;
        const data = await User.aggregate([
            {
                $facet: {
                    'gradeWiseTotalStudent': [
                        {
                            $match: {
                                "schoolDetails.school": new ObjectId(
                                    id
                                ),
                            },
                        },
                        {
                            $group: {
                                _id: {
                                    grade: "$schoolDetails.grade",
                                },
                                users: {
                                    $sum: 1,
                                },
                            },
                        },
                        {
                            $project: {
                                grade: "$_id.grade",
                                _id: 0,
                                users: 1,
                            },
                        },
                    ],
                    'recentJoinee': [
                        {
                            $match: {
                                "schoolDetails.school": new ObjectId(
                                    id
                                ),
                            },
                        },
                        {
                            $project: {
                                grade: "$schoolDetails.grade",
                                joining_date: "$joining_date",
                                dob: "$schoolDetails.dob",
                                full_name: '$student_name',
                                image: "$schoolDetails.profilePhoto"
                            },
                        },
                        {
                            $sort: {
                                joining_date: -1
                            }
                        },
                        {
                            $limit: 20
                        }
                    ]
                }
            }
        ])

        res.status(201).json({ status: 'success', data: data });
    } catch (error) {
        res.status(500).json({ status: 'success', data: error });
    }
}

exports.getStudentsQuizWise = async (req, res) => {
    try {
        const id = req.user._id;
        const { quizId } = req.params;
        const data = await Quiz.aggregate([
            {
                $match: {
                    _id: new ObjectId(quizId),
                },
            },
            {
                $unwind: {
                    path: "$registrations",
                },
            },
            {
                $lookup: {
                    from: "user-personal-details",
                    localField: "registrations.userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                },
            },
            {
                $match: {
                    "user.schoolDetails.school": new ObjectId(
                        id
                    ),
                },
            },
            {
                $facet: {
                    'gradeWise': [
                        {
                            $group: {
                                _id: {
                                    grade: "$user.schoolDetails.grade",
                                },
                                users: {
                                    $sum: 1,
                                },
                            },
                        },
                        {
                            $project: {
                                grade: "$_id.grade",
                                users: 1,
                                _id: 0,
                            },
                        },
                    ],
                    'recentStudent': [
                        {
                            $project: {
                                grade: "$user.schoolDetails.grade",
                                registration_date: "$registrations.registeredOn",
                                dob: "$user.schoolDetails.dob",
                                full_name: "$user.student_name",
                                image: "$user.schoolDetails.profilePhoto",
                            },
                        },
                        {
                            $sort: {
                                joining_date: -1
                            }
                        },
                        {
                            $limit: 20
                        }
                    ],
                    'datewiseStudent': [
                        {
                            $group: {
                                _id: {
                                    date: {
                                        $dateToString: {
                                            format: "%Y-%m-%d",
                                            date: "$registrations.registeredOn",
                                        },
                                    },
                                },
                                users: {
                                    $sum: 1,
                                },
                            },
                        },
                        {
                            $project: {
                                date: "$_id.date",
                                users: 1,
                                _id: 0,
                            },
                        },
                    ],
                    'totalCount': [
                        {
                            $group: {
                                _id: {},
                                totalRegistration: {
                                    $sum: 1,
                                },
                                totalFee: {
                                    $sum: "$registrations.fee",
                                },
                            },
                        },
                        {
                            $project: {
                                totalRegistration: 1,
                                totalFee: 1,
                                _id: 0,
                            },
                        },
                    ],
                },
            },
        ])

        res.status(201).json({ status: 'success', data: data });
    } catch (error) {
        res.status(500).json({ status: 'success', data: error });
    }
}

exports.getStudentsQuizWiseFullList = async (req, res) => {
    try {
        const id = req.user._id;
        const { quizId } = req.params;
        const data = await Quiz.aggregate([
            {
                $match: {
                    _id: new ObjectId(quizId),
                },
            },
            {
                $unwind: {
                    path: "$registrations",
                },
            },
            {
                $lookup: {
                    from: "user-personal-details",
                    localField: "registrations.userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                },
            },
            {
                $match: {
                    "user.schoolDetails.school": new ObjectId(
                        id
                    ),
                },
            },
            {
                $project: {
                    grade: "$user.schoolDetails.grade",
                    registration_date: "$registrations.registeredOn",
                    dob: "$user.schoolDetails.dob",
                    full_name: "$user.student_name",
                },
            },
        ])

        res.status(201).json({ status: 'success', data: data });
    } catch (error) {
        res.status(500).json({ status: 'success', data: error });
    }
}

exports.getTotalStudentsFullList = async (req, res) => {
    try {
        const id = req.user._id;
        const data = await User.aggregate([
            {
                $match: {
                    "schoolDetails.school": new ObjectId(
                        id
                    ),
                },
            },
            {
                $project: {
                    grade: "$schoolDetails.grade",
                    joining_date: "$joining_date",
                    dob: "$schoolDetails.dob",
                    full_name: '$student_name',
                },
            }
        ])

        res.status(201).json({ status: 'success', data: data });
    } catch (error) {
        res.status(500).json({ status: 'success', data: error });
    }
}


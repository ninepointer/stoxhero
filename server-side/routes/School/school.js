const express = require('express');
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');
const schoolController = require('../../controllers/school/schoolOnboarding');
const router = express.Router();

const multer = require('multer');

const storage = multer.memoryStorage(); // Using memory storage

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

router.post(
    '/', Authenticate, restrictTo('Admin', 'SuperAdmin'),
    upload.fields([{ name: 'image', maxCount: 1 }, { name: 'logo', maxCount: 1 }]),
    schoolController.createSchool
);

router.get(
    '/active', Authenticate, restrictTo('Admin', 'SuperAdmin'),
    schoolController.getAllActiveSchool
);

router.get(
    '/inactive', Authenticate, restrictTo('Admin', 'SuperAdmin'),
    schoolController.getAllInactiveSchool
);

router.get(
    '/draft', Authenticate, restrictTo('Admin', 'SuperAdmin'),
    schoolController.getAllDraftSchool
);

router.get(
    '/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'),
    schoolController.getSchoolById
);

router.patch(
    '/:id', Authenticate, restrictTo('Admin', 'SuperAdmin'),
    upload.fields([{ name: 'image', maxCount: 1 }, { name: 'logo', maxCount: 1 }]),
    schoolController.editSchool
);


module.exports = router;
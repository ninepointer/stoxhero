const ChallengeTemplate = require('../../models/challenges/challengeTemplates');  
const Challenge = require('../../models/challenges/challenge');

exports.createChallengesFromTemplate = async (req, res) => {
    try {
        const templateId = req.params.templateId;

        // Fetch the challengeTemplate using the provided ID
        const challengeTemplate = await ChallengeTemplate.findById(templateId);
        
        if (!challengeTemplate) {
            return res.status(404).json({
                status: 'error',
                message: 'Challenge template not found.'
            });
        }

        const { startTime, endTime, challengeParameters } = challengeTemplate;

        if (!challengeParameters || challengeParameters.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Challenge parameters not found in the template.'
            });
        }

        // Assuming there is only one challengeParameter for now. 
        const interval = challengeParameters[0].interval;

        const start = new Date(startTime);
        const end = new Date(endTime);

        // List to hold new challenge instances
        let challengesToCreate = [];

        while (start < end) {
            const challengeLiveTime = new Date(start);
            
            start.setMinutes(start.getMinutes() + interval);

            const challengeEndTime = new Date(start);
            const challengeStartTime = new Date(challengeEndTime);
            challengeStartTime.setMinutes(challengeStartTime.getMinutes() - (interval - 2));

            challengesToCreate.push({
                challengeTemplate: templateId,
                challengeLiveTime,
                challengeStartTime,
                challengeEndTime,
                status: 'Active',
                createdBy: req.user._id, 
                lastModifiedBy: req.user._id
            });
        }

        const createdChallenges = await Challenge.insertMany(challengesToCreate);

        res.status(201).json({
            status: 'success',
            message: 'Challenges created successfully.',
            data: createdChallenges
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong while creating challenges from template.',
            error: error.message
        });
    }
};

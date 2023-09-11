const express = require("express");
const Authenticate = require('../../authentication/authentication');
const router = express.Router({mergeParams: true});
const {createBattleTemplate, editBattleTemplate, getAllBattleTemplates, getActiveBattleTemplates, getBattleTemplateById,
    getDraftBattleTemplates, getInactiveBattleTemplates} = require('../../controllers/battles/battleTemplateController');
const restrictTo = require('../../authentication/authorization');

router.route('/').post(Authenticate, restrictTo('Admin', 'SuperAdmin'), createBattleTemplate).
    get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getAllBattleTemplates);
router.route('/active').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getActiveBattleTemplates);
router.route('/draft').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getDraftBattleTemplates);
router.route('/inactive').get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getInactiveBattleTemplates);
router.route('/:id').patch(Authenticate, restrictTo('Admin', 'SuperAdmin'), editBattleTemplate)
        .get(Authenticate, restrictTo('Admin', 'SuperAdmin'), getBattleTemplateById);;

module.exports = router;
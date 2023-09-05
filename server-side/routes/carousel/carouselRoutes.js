const express = require('express');
const Authenticate = require('../../authentication/authentication');
const restrictTo = require('../../authentication/authorization');
const { getCarousels, getCarousel, editCarousel, deleteCarousel, createCarousel,
uploadMulter, uploadToS3, resizePhoto, getActiveCarousels, getLiveCarousels, getHomePageCarousels,
getInfinityLiveCarousels, getStoxHeroLiveCarousels, getUpcomingInfinityCarousels, 
getUpcomingStoxHeroCarousels, getUpcomingCarousels, getDraftCarousels, getPastCarousels } = require('../../controllers/carouselController');
const Carousel = require('../../models/carousel/carouselSchema');

const router = express.Router();

const currentUser = (req,res,next) =>{
    req.params.id = (req).user._id;
    next(); 
}
router.route('/').get(getCarousels).post(Authenticate, restrictTo('Admin', 'Super Admin'), uploadMulter, resizePhoto, uploadToS3 ,createCarousel);
router.route('/active').get(getActiveCarousels)
router.route('/infinitylive').get(Authenticate, getInfinityLiveCarousels)
router.route('/stoxherolive').get(Authenticate, getStoxHeroLiveCarousels)
router.route('/infinityupcoming').get(getUpcomingInfinityCarousels)
router.route('/stoxheroupcoming').get(getUpcomingStoxHeroCarousels)
router.route('/live').get(Authenticate, getLiveCarousels)
router.route('/upcoming').get(getUpcomingCarousels)
router.route('/home').get(Authenticate,getHomePageCarousels)
router.route('/draft').get(Authenticate, getDraftCarousels)
router.route('/past').get(Authenticate, getPastCarousels)
router.route('/:id').get(Authenticate, getCarousel).patch(Authenticate,restrictTo('Admin', 'Super Admin'), uploadMulter, resizePhoto, 
uploadToS3,editCarousel).delete(Authenticate, restrictTo('Admin', 'Super Admin'), deleteCarousel);


module.exports=router;
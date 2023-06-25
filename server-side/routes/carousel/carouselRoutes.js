const express = require('express');
const Authenticate = require('../../authentication/authentication');
const { getCarousels, getCarousel, editCarousel, deleteCarousel, createCarousel,
uploadMulter, uploadToS3, resizePhoto, getActiveCarousels, getLiveCarousels, getHomePageCarousels,
getInfinityLiveCarousels, getStoxHeroLiveCarousels, getUpcomingInfinityCarousels, 
getUpcomingStoxHeroCarousels, getUpcomingCarousels, getDraftCarousels } = require('../../controllers/carouselController');
const Carousel = require('../../models/carousel/carouselSchema');

const router = express.Router();

const currentUser = (req,res,next) =>{
    req.params.id = (req).user._id;
    next(); 
}
router.route('/').get(getCarousels).post(Authenticate, uploadMulter, resizePhoto, uploadToS3 ,createCarousel);
router.route('/active').get(getActiveCarousels)
router.route('/infinitylive').get(getInfinityLiveCarousels)
router.route('/stoxherolive').get(getStoxHeroLiveCarousels)
router.route('/infinityupcoming').get(getUpcomingInfinityCarousels)
router.route('/stoxheroupcoming').get(getUpcomingStoxHeroCarousels)
router.route('/live').get(getLiveCarousels)
router.route('/upcoming').get(getUpcomingCarousels)
router.route('/home').get(Authenticate,getHomePageCarousels)
router.route('/draft').get(getDraftCarousels)
router.route('/:id').get(Authenticate, getCarousel).patch(Authenticate,uploadMulter, resizePhoto, 
uploadToS3,editCarousel).delete(Authenticate, deleteCarousel);


module.exports=router;
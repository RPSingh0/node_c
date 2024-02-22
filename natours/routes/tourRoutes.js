const express = require("express");
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');
// const reviewController = require('./../controllers/reviewController');

const router = express.Router();

// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews
// GET /tour/234fad4/reviews/94887fda
// router.route('/:tourId/reviews')
//     .post(
//         authController.protect,
//         authController.restrictTo('user'),
//         reviewController.createReview
//     );
// MOUNTING THE ROUTER AND DELEGATING TASK TO REVIEW-ROUTER
router.use('/:tourId/reviews', reviewRouter);

// fav routs
router.route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats')
    .get(tourController.getTourStats);

router.route('/monthly-plan/:year')
    .get(tourController.getMonthlyPlan);

router.route('/')
    .get(authController.protect, tourController.getAllTours)
    .post(tourController.createTour);

router.route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

module.exports = router;
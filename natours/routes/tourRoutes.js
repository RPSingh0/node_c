const express = require("express");
const tourController = require('./../controllers/toursController');

const router = express.Router();

// adding a middleware that will run only when we have the 'id' parameter.
router.param('id', tourController.checkID);

router.route('/')
    .get(tourController.getAllTours)
    .post(tourController.checkBody, tourController.createTour);

router.route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;
const express = require("express");

const tourController = require("../controllers/tourController");

const TourRouter = express.Router();

TourRouter
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.addTour);

TourRouter
  .route("/:id")
  .get(tourController.getOneTour)
  .patch(tourController.patchOneTour)
  .delete(tourController.deleteOneTour);

TourRouter.param("id" , tourController.checkId);

module.exports = TourRouter;

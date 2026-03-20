const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");



//show reviews
router.get("/", reviewController.getReviewsPage);
//create review
router.post("/", reviewController.createReview);
//update reviews
router.post("/update",reviewController.updateReview);
//delete review
router.post("/delete", reviewController.deleteReview);

module.exports = router;
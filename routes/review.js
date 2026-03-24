const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");



//show reviews
router.get("/", reviewController.getReviewsPage);
//create review
router.post("/", reviewController.createReview);
//update reviews
router.post("/update",reviewController.updateReview);
router.get("/edit", reviewController.getUpdatePage);
//delete review
router.post("/delete", reviewController.deleteReview);
//update reviews
router.post("/vote", reviewController.voteReview);


module.exports = router;
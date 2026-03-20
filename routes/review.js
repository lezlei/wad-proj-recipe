const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");



//show reviews
router.get("/:recipeId", reviewController.getReviewsPage);
//create review
router.post("/", reviewController.createReview);
//update reviews
router.post("/update/:id",reviewController.updateReview);
//delete review
router.post("/delete/:id", reviewController.deleteReview);

module.exports = router;
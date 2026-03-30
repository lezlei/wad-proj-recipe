const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth-middleware');

const reviewController = require("../controllers/reviewController");



//show reviews
router.get("/", reviewController.getReviewsPage);
//create review
router.post("/", auth.isLoggedIn,reviewController.createReview);
//update reviews
router.post("/update",reviewController.updateReview);
router.get("/edit", reviewController.getUpdatePage);
//delete review
router.post("/delete", reviewController.deleteReview);
//update reviews
router.post("/vote", reviewController.voteReview);
//delete review
router.post("/delete-all", reviewController.deleteAllReviews);
//create tread review
router.post("/reply", reviewController.addReply);
//delete replies
router.post("/reply/delete", reviewController.deleteReply);

module.exports = router;
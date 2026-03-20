const review = require("../models/review");
const recipe = require("../models/Recipe");



exports.createReview = async (req, res) => {
    try {
        let recipeId = req.body.recipeId;
        let rating = req.body.rating;
        let comment = req.body.comment;
        let userId= req.session.userId;

        const newReview = {
        user: userId,
        recipe: recipeId,
        rating: rating,
        comment: comment
      };

      await review.create(newReview);

        res.redirect('/reviews?recipeId=' + recipeId)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateReview = async (req, res) => {
  try {

    const reviewId = req.body.reviewId;
    const rating = req.body.rating;
    const comment = req.body.comment;

    const reviewData = await review.findById(reviewId);

    await review.findByIdAndUpdate(
      reviewId,
      { rating: rating, comment: comment }
    );

    res.redirect('/reviews?recipeId=' + reviewData.recipe);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deleteReview = async (req, res) => {
  try {

    const reviewId = req.body.reviewId;

    const reviewData = await review.findById(reviewId);

    await review.findByIdAndDelete(reviewId);

    res.redirect('/reviews?recipeId=' + reviewData.recipe);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getReviewsPage = async (req, res) => {
  try {

    const recipeId = req.query.recipeId || '';

    const reviews = await review.find({ recipe: recipeId });

    res.render('review', { reviews, recipeId });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getUpdatePage = async (req, res) => {
  try {
    const reviewData = await review.findById(req.params.id);

    res.render("edit-review", { review: reviewData });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const Review = require("../models/review");
const Recipe = require("../models/Recipe");

// Create a new review
exports.createReview = async (req, res) => {
  if (!req.session.userId) return res.send("You must be logged in.");

  try {
    const recipeId = req.body.recipeId;
    const rating = Number(req.body.rating);
    const comment = req.body.comment;
    const userId = req.session.userId;

    const existingReview = await Review.findOne({ user: userId, recipe: recipeId });
    if (existingReview) return res.send("You have already reviewed this recipe.");

    await Review.create({ user: userId, recipe: recipeId, rating, comment });

    const recipeData = await Recipe.findById(recipeId);

    // Ensure safe numbers
    const currentCount = recipeData.reviewCount || 0;
    const currentAvg = recipeData.avgScore || 0;

    const newCount = currentCount + 1;
    const newAvg = (currentAvg * currentCount + rating) / newCount;

    await Recipe.findByIdAndUpdate(recipeId, { reviewCount: newCount, avgScore: newAvg });

    res.redirect('/reviews?recipeId=' + recipeId);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing review
exports.updateReview = async (req, res) => {
  if (!req.session.userId) return res.send("You must be logged in.");

  try {
    const reviewId = req.body.reviewId;
    const rating = Number(req.body.rating);
    const comment = req.body.comment;
    const userId = req.session.userId;
    const userRole = req.session.role;

    const reviewData = await Review.findById(reviewId).populate("user");
    if (!reviewData) return res.send("Review not found.");

    if (reviewData.user._id.toString() !== userId && userRole !== "admin") {
      return res.send("Unauthorized");
    }

    const oldRating = reviewData.rating;
    await Review.findByIdAndUpdate(reviewId, { rating, comment });

    const recipeData = await Recipe.findById(reviewData.recipe);
    const reviewCount = recipeData.reviewCount || 1; // cannot be 0 here

    const newAvg = (recipeData.avgScore * reviewCount - oldRating + rating) / reviewCount;

    await Recipe.findByIdAndUpdate(reviewData.recipe, { avgScore: newAvg });

    res.redirect('/reviews?recipeId=' + reviewData.recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  if (!req.session.userId) return res.send("You must be logged in.");

  try {
    const reviewId = req.body.reviewId;
    const userId = req.session.userId;
    const userRole = req.session.role;

    const reviewData = await Review.findById(reviewId).populate("user");
    if (!reviewData) return res.send("Review not found.");

    if (reviewData.user._id.toString() !== userId && userRole !== "admin") {
      return res.send("Unauthorized");
    }

    const recipeData = await Recipe.findById(reviewData.recipe);
    const currentCount = recipeData.reviewCount || 1;
    const currentAvg = recipeData.avgScore || 0;

    const newCount = Math.max(currentCount - 1, 0);
    let newAvg = 0;
    if (newCount > 0) {
      newAvg = (currentAvg * currentCount - reviewData.rating) / newCount;
    }

    await Recipe.findByIdAndUpdate(reviewData.recipe, { reviewCount: newCount, avgScore: newAvg });

    await Review.findByIdAndDelete(reviewId);

    res.redirect('/reviews?recipeId=' + reviewData.recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Render reviews page
exports.getReviewsPage = async (req, res) => {
  try {
    const recipeId = req.query.recipeId || '';
    const reviews = await Review.find({ recipe: recipeId }).populate("user");
    res.render('review', { reviews, recipeId, userId: req.session.userId, role: req.session.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Render edit review page
exports.getUpdatePage = async (req, res) => {
  try {
    const reviewId= req.query.reviewId;
    const reviewData = await Review.findById(reviewId);
    res.render("edit-review", { review: reviewData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
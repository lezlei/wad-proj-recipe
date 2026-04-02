const Review = require("../models/review");
const Recipe = require("../models/Recipe");

// Create a new review
exports.createReview = async (req, res) => {

  try {
    const recipeId = req.body.recipeId;
    const rating = Number(req.body.rating);
    const comment = req.body.comment;
    const userId = req.session.userId;

    const existingReview = await Review.findOne({ user: userId, recipe: recipeId });
    if (existingReview) return res.send(`You have already reviewed this recipe.<br><a href="/reviews?recipeId=${recipeId}">Back to Reviews</a>`);

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


  try {
    const reviewId = req.body.reviewId;
    const rating = Number(req.body.rating);
    const comment = req.body.comment;
    const userId = req.session.userId;
    const userRole = req.session.role;

    const reviewData = await Review.findById(reviewId).populate("user");
    // this is for mongoDB to go and fetch the review data based on the userId so we can do reviewData.recipe;
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
    const deleted = req.query.deleted || false;
    const openReview = req.query.openReview || null;

    let reviews = await Review.find({ recipe: recipeId })
    .populate("user")
    .populate("replies.user"); 

    reviews.sort((a, b) => {
      const scoreA =
        (a.votes || []).filter(v => v.value === 1).length -
        (a.votes || []).filter(v => v.value === -1).length;

      const scoreB =
        (b.votes || []).filter(v => v.value === 1).length -
        (b.votes || []).filter(v => v.value === -1).length;

      return scoreB - scoreA;
    });

    res.render('review', {
      reviews,
      recipeId,
      userId: req.session.userId,
      role: req.session.role,
      deleted,
      openReview
    });

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
// Vote a review
exports.voteReview = async (req, res) => {
  

  try {
    const { reviewId, value } = req.body;
    const userId = req.session.userId;

    const review = await Review.findById(reviewId);

    const existingVote = review.votes.find(
      v => v.user.toString() === userId
    );

    if (existingVote) {
      if (existingVote.value === Number(value)) {
        // ✅ REMOVE vote (toggle off)
        review.votes = review.votes.filter(
          v => v.user.toString() !== userId
        );
      } else {
        // 🔄 SWITCH vote
        existingVote.value = Number(value);
      }
    } else {
      // ➕ NEW vote
      review.votes.push({ user: userId, value: Number(value) });
    }

    await review.save();

    res.redirect('/reviews?recipeId=' + review.recipe);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Delete all reviews
exports.deleteAllReviews = async (req, res) => {
  if (!req.session.userId || req.session.role !== "admin") {
    return res.send("Unauthorized");
  }

  try {
    const recipeId = req.body.recipeId;

    // Delete all reviews for this recipe
    await Review.deleteMany({ recipe: recipeId });

    // Reset recipe stats
    await Recipe.findByIdAndUpdate(recipeId, {
      reviewCount: 0,
      avgScore: 0
    });

    res.redirect('/reviews?recipeId=' + recipeId + '&deleted=true');

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Create a tread review
exports.addReply = async (req, res) => {
  

  try {
    const { reviewId, comment } = req.body;
    const userId = req.session.userId;

    const review = await Review.findById(reviewId);
    if (!review) return res.send("Review not found.");

    review.replies.push({
      user: userId,
      comment
    });

    await review.save();

    res.redirect('/reviews?recipeId=' + review.recipe + '&openReview=' + reviewId);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Delete replies
exports.deleteReply = async (req, res) => {
  

  try {
    const { reviewId, replyId } = req.body;
    const userId = req.session.userId;
    const userRole = req.session.role;

    const review = await Review.findById(reviewId);
    if (!review) return res.send("Review not found.");

    const reply = review.replies.id(replyId);
    if (!reply) return res.send("Reply not found.");

    // ✅ Authorization (owner or admin)
    if (reply.user.toString() !== userId && userRole !== "admin") {
      return res.send("Unauthorized");
    }

    // ✅ Remove reply
    review.replies = review.replies.filter(
      r => r._id.toString() !== replyId
    );

    await review.save();

    res.redirect('/reviews?recipeId=' + review.recipe);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
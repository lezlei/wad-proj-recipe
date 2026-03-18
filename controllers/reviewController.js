const review = require("../models/review");


exports.addReview = function (newReview) {
    return review.create(newReview);
}
exports.updateReview = function (userId,recipeId,updatedData) {
    return review.findOneAndUpdate(
        {user: userId, recipe: recipeId}, updatedData, 
        {new:true}
    )
}
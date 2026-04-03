const User = require('./User');
const Review = require("./review");
const Recipe = require("./Recipe");

exports.getAllUsers = async function () {
    return await User.find({})
}

exports.updateRole = async function (userId, newRole) {
    try {
        let result = await User.updateOne({ _id: userId}, {role:newRole})
        return result.modifiedCount > 0

    } catch (error) {
        console.error(error)
        return false
    }
}

exports.SuspendUser = async function (userId) {
    try {
        let user = await User.findById(userId)

        if (!user) {
            return false
        }

        const newStatus = !user.isSuspended

        const result = await User.updateOne({ _id: userId}, {isSuspended: newStatus})
        return result.modifiedCount > 0
    } catch (error) {
        console.error(error)
    }
}

exports.DeleteUser = async function (userId) {
    try {
        let user = await User.findById(userId)

        if (!user) {
            return false
        }

        const userReviews = await Review.find({ user: userId })

        for (const review of userReviews) {
            const recipe = await Recipe.findById(review.recipe)
            if (!recipe) continue

            const currentCount = recipe.reviewCount || 1
            const currentAvg = recipe.avgScore || 0
            const newCount = Math.max(currentCount - 1, 0)
            const newAvg = newCount > 0
                ? (currentAvg * currentCount - review.rating) / newCount
                : 0

            await Recipe.findByIdAndUpdate(review.recipe, { reviewCount: newCount, avgScore: newAvg })
        }

        await Review.updateMany(
            { "replies.user": userId },
            { $pull: { replies: { user: userId } } }
        )

        await Review.deleteMany({ user: userId })
        const result = await User.deleteOne({ _id: userId})
        return result.deletedCount > 0
    } catch (error) {
        console.error(error)
    }
}
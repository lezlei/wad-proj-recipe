const User = require('./User')
const Review = require("./review");

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

        await Review.deleteMany({ user: userId })
        const result = await User.deleteOne({ _id: userId})
        return result.deletedCount > 0
    } catch (error) {
        console.error(error)
    }
}
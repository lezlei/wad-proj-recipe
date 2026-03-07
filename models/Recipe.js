const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
    title: String,
    description: String,
    ingredients: [String],
    instructions: String,
    authorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model("Recipe", recipeSchema)
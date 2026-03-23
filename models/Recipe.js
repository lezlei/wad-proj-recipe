const mongoose = require('mongoose');

// Recipe Schema
const recipeSchema = new mongoose.Schema({
    title: String,
    cuisine: String,
    description: String,
    ingredients: [String],
    instructions: String,
    authorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    avgScore: {
        type: Number,
        default: 0
    }
});

// Create Mongoose model
const Recipe = mongoose.model("Recipe", recipeSchema, 'recipes');

// --- Helper functions ---

// Function to find User's recipes by userId
Recipe.findByUserId = function(id){
    return Recipe.find({ authorID: id });
};

// Function to retrieve all recipes from database
Recipe.retrieveAll = function(){
    return Recipe.find().populate('authorID');
};

// Function to add a recipe into the database
Recipe.addRecipe = function(newRecipe){
    return Recipe.create(newRecipe);
};

// Function to find a recipe in the database
Recipe.findOneRecipe = function(recipeId, authorId) {
    return Recipe.findOne({ _id: recipeId, authorID: authorId });
};

// Function to update/edit a recipe in the database
Recipe.updateRecipe = function(recipeId, authorId, updatedData) {
    return Recipe.findOneAndUpdate(
        { _id: recipeId, authorID: authorId }, 
        updatedData,                          
        { returnDocument: 'after' }                          
    );
};

// Function to filter recipes by same titles when searching
Recipe.searchByTitle = function(query){
    return Recipe.find({ title : { $regex: query, $options: 'i' } }).populate('authorID');
};

// Function to filter recipes by same author when searching
Recipe.searchByAuthor = function(userIds) {
    return Recipe.find({ authorID: { $in : userIds } }).populate('authorID');
};

// Function to filter recipes by same ingredient when searching
Recipe.searchByIngredient = function(query) {
    return Recipe.find({ ingredients: {$elemMatch : { $regex: query, $options: 'i' } }}).populate('authorID');
};

// Function to filter recipes by same cuisine when searching
Recipe.searchByCuisine = function(query) {
    return Recipe.find({ cuisine : { $regex: query, $options: 'i' } }).populate('authorID');
};

// Function to delete a recipe from database
Recipe.deleteRecipe = function(recipeId, authorId) {
    return Recipe.findOneAndDelete({ _id: recipeId, authorID: authorId });
};

// Export the model (with helpers attached)
module.exports = Recipe;
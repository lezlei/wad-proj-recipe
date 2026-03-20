const mongoose = require('mongoose')

// Recipe Schema
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

const Recipe = mongoose.model("Recipe", recipeSchema, 'recipes');

// Function to find User's recipes by userid
exports.findByID = function(id){
    return Recipe.find({ authorID : id });
};

// Function to retrieve all recipes from database
exports.retrieveAll = function(){
    return Recipe.find().populate('authorID');
};

// Function to add a recipe into the database
exports.addRecipe = function(newRecipe){
    return Recipe.create(newRecipe);
};

// Function to find a recipe in the database
exports.findOneRecipe = function(recipeId, authorId) {
    return Recipe.findOne({ _id: recipeId, authorID: authorId });
};

// Function to update/edit a recipe in the database
exports.updateRecipe = function(recipeId, authorId, updatedData) {
    return Recipe.findOneAndUpdate(
        { _id: recipeId, authorID: authorId }, 
        updatedData,                          
        {returnDocument: 'after'}                          
    );
};

// Function to filter recipes by same titles when searching
exports.searchByTitle = function(query){
    return Recipe.find({ title : { $regex: query, $options: 'i' } }).populate('authorID');
};

// Function to filter recipes by same author when searching
exports.searchByAuthor = function(userIds) {
    return Recipe.find({ authorID: { $in : userIds } }).populate('authorID');
};

// Function to delete a recipe from database
exports.deleteRecipe = function(recipeId, authorId) {
    return Recipe.findOneAndDelete({ _id: recipeId, authorID: authorId });
};

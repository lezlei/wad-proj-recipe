const mongoose = require('mongoose');
const User = require('../models/User');

// Recipe Schema
const recipeSchema = new mongoose.Schema({
    title: String,
    cuisine: String,
    description: String,
    ingredients: [String],
    instructions: [String],
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

// Function to filter in Search Bar
Recipe.searchByFilter = async function(search, filters) {

    // Empty array for search conditions
    const searchConditions = []

    // Split User's search into words
    const words = search.trim().split(/\s+/);
    
    // Loop each word in words array
    for (const word of words) {
        // regex for each word which includes the word & makes it case insensitive
        const regex = { $regex: word, $options: 'i' };

        if (filters.includes('title')) {
            searchConditions.push({ title: regex });
        }    
        if (filters.includes('ingredients')) {
            searchConditions.push({ ingredients: regex });
        } 
        if (filters.includes('cuisine')) {
            searchConditions.push({ cuisine: regex });
        }    
        if (filters.includes('author')) {
            const matchedUsers = await User.find({ username: regex });
            // Extract User IDs into an array
            const userIds = matchedUsers.map(u => u._id);
            // Push into searchConditions to check if Recipe's authorIds is inside UserIds Array
            if (userIds.length) {
                searchConditions.push({ authorID: { $in: userIds } });
            }   
        }
    }

  // Finds all recipes that matches any conditions inside of searchConditions array 
  return searchConditions.length ? Recipe.find({ $or: searchConditions }).populate('authorID', 'username') : []; 
}

// Function to delete a recipe from database
Recipe.deleteRecipe = function(recipeId, authorId) {
    return Recipe.findOneAndDelete({ _id: recipeId, authorID: authorId });
};

// Function to get a random recipe from the database
Recipe.getRandom = async function(userId, seenIds = []){

    const person = await User.findById(userId);   
    const favourites = person ? person.favourites : [];

    const excludeIds = [...new Set([...seenIds, ...favourites])];

    const query = {
    authorID: { $ne: userId },      
    _id: { $nin: excludeIds }                 
  };

  const count = await Recipe.countDocuments(query);
  if (count === 0) return null;            

  const skip = Math.floor(Math.random() * count);

  return Recipe.findOne(query).skip(skip).populate('authorID');
};


// Function to get the top three recipe that have the highest reviews
Recipe.getTrending = async function() {

    const topRated = await Recipe.find().sort({ avgScore : -1, reviewCount : -1}).limit(3);
    return topRated;
    
};

// Export the model (with helpers attached)
module.exports = Recipe;
const User = require('../models/User');
const Recipe = require('../models/Recipe');

exports.displayReco = async (req,res) => {
    try {
        const randomRecipe = await Recipe.getRandom();

        res.render('recipe/rng', {randomRecipe});
    } catch (err) {
        console.log("Error:", err);
        res.send('Failed to display recommendation form.');
    };
};

exports.redisplayReco = async (req,res) => {
    try {
        const randomRecipe = await Recipe.getRandom();

        res.render('recipe/rng', {randomRecipe});
    } catch (err) {
        console.log("Error:", err);
        res.send('Failed to redisplay recommendation form.');
    };
};

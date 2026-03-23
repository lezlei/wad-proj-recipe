const User = require('../models/User');
const Recipe = require('../models/Recipe');

exports.displayReco = async (req,res) => {
    try {
        const currentUserID = req.session.userId;

        if (!currentUserID) {
            return res.redirect('/auth/login');
        }
        
        if (!req.session.seenRecipes) {
            req.session.seenRecipes = [];
        }

        const randomRecipe = await Recipe.getRandom(currentUserID, req.session.seenRecipes);
        
        if (!randomRecipe) {
            req.session.seenRecipes = [];
            return res.render('recipe/rng', { randomRecipe: null, message: 'You have seen all recipes!' });
        }

        // add current recipe to seen list
        req.session.seenRecipes.push(randomRecipe._id.toString());

        res.render('recipe/rng', {randomRecipe, message: ''});

    } catch (err) {
        console.log("Error:", err);
        res.send('Failed to display recommendation form.');
    };
};
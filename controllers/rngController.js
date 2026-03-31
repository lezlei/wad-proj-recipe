const User = require('../models/User');
const Recipe = require('../models/Recipe');

exports.displayReco = async (req,res) => {
    try {

        // Checks if user is logged in
        const currentUserID = req.session.userId;

        if (!currentUserID) {
            return res.redirect('/auth/login');
        }
        
        // If user has not seen any new recipes yet
        if (!req.session.seenRecipes) {
            req.session.seenRecipes = [];
        }   

        // Get favmessage from session and reset it to empty
        const favmessage = req.session.favmessage || '';
        req.session.favmessage = '';

        // If user has seen the recipe before and added it to favourites, render the same recipe
        if (req.session.currentRecipeId) {
            const sameRecipe = await Recipe.findById(req.session.currentRecipeId).populate('authorID');
            return res.render('recipe/rng', { randomRecipe: sameRecipe, message: '', favmessage });
        }

        // Gets a random recipe that has not been seen by user yet
        const randomRecipe = await Recipe.getRandom(currentUserID, req.session.seenRecipes);

        // If user has seen all recipes available to them, render the page to show that they have seen all recipes
        if (!randomRecipe) {
            req.session.seenRecipes = [];
            req.session.currentRecipeId = null;
            return res.render('recipe/rng', { randomRecipe: null, message: 'You have seen all recipes!', favmessage });
        }

        // Add current recipe to seen list
        req.session.seenRecipes.push(randomRecipe._id.toString());

        // Save current recipe
        req.session.currentRecipeId = randomRecipe._id.toString();

        res.render('recipe/rng', {randomRecipe, message: '', favmessage});

    } catch (err) {
        console.log("Error:", err);
        res.send('Failed to display recommendation form.');
    };
};

exports.addFavourite = async (req,res) => {
    try {
        // Gets current userid
        const currentUserID = req.session.userId;

        // Gets current recipeid
        const recipeID = req.params.recipeId;

        // Checks if recipe already inside user's array of favourites
        const user = await User.findById(currentUserID);
        const alreadyFavourited = user.favourites.includes(recipeID)



        // Appends new recipeid into user's array of favourites if not inside already
        if (alreadyFavourited){
            req.session.favmessage = 'Already added to favourites!'
        } else {
            await User.findByIdAndUpdate(currentUserID, {
                $addToSet : { favourites : recipeID }
            });

            req.session.favmessage = 'Added to favourites!'
        };

        res.redirect('/recipes/recommendation');
    
    } catch (err) {
        console.log("Error:", err);
        res.send('Failed to add to favourites.');
    };
};

exports.displayNextReco = async (req,res) => {
    try{
        req.session.currentRecipeId = null;
        res.redirect('/recipes/recommendation')
    } catch (err) {
        console.log("Error:", err);
        res.send('Failed to get next recommendation.');
    };
};

exports.clearReco = async (req,res) => {
    try {
        req.session.currentRecipeId = null;
        res.redirect('/recipes#all-recipes')
    } catch (err) {
        console.log("Error:", err);
        res.send('Failed to clear recommendation.');
    };
}

exports.removeFavourite = async (req, res) => {
    try {
        const currentUserID = req.session.userId;
        const recipeID = req.params.recipeId;

        if (!currentUserID) {
            return res.redirect('/auth/login');
        }

        // Use $pull to remove the recipeID from the favourites array
        await User.findByIdAndUpdate(currentUserID, {
            $pull: { favourites: recipeID }
        });

        console.log(`User ${currentUserID} removed recipe ${recipeID} from favourites.`);
        
        // Redirect back to the recipes browse page
        res.redirect('/recipes');
        
    } catch (err) {
        console.log("Error:", err);
        res.send('Failed to remove from favourites.');
    }
};
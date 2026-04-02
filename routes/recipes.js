const express = require("express");
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const rngController = require('../controllers/rngController');
const auth = require('../middleware/auth-middleware')

// Get and display all recipes from specific user and everyone else when 'Browse Recipes' is clicked
router.get("/recipes", auth.isLoggedIn, recipeController.displayRecipes);

// Get Form to create recipe
router.get('/recipes/create', auth.isLoggedIn, recipeController.createGet);

// Post Form after filling in the recipe form
router.post('/recipes/create', auth.isLoggedIn, recipeController.createPost);



// DYNAMIC routes to displayReco/addFav

// GET Form for recommendation
router.get('/recipes/recommendation', auth.isLoggedIn, rngController.displayReco);

// POST Form for adding to favourites
router.post('/favourites/:recipeId/add', auth.isLoggedIn, rngController.addFavourite);

// POST Form to add a recipe to favourites from the browse page
router.post('/recipes/:recipeId/favourite', auth.isLoggedIn, recipeController.addFavouriteFromBrowse);

// GET Form for next recommendation
router.get('/recipes/recommendation/next', auth.isLoggedIn, rngController.displayNextReco);

// GET Form to clear recommendation when user returns to main recipes page
router.get('/recommendation/clear', auth.isLoggedIn, rngController.clearReco);

// POST Form for removing from favourites
router.post('/favourites/:recipeId/delete', auth.isLoggedIn, rngController.removeFavourite);

// GET Form for retrieving one of the Top 3 Rated Recipe
router.get('/recipes/:topRatedId', auth.isLoggedIn, recipeController.viewTopRated);

// POST Form to add favourite when user in Top Rated Recipe Page
router.post('/recipes/:topRatedId/add', auth.isLoggedIn, recipeController.addFavouriteFromTopRated);

// POST Form to update a personal note for a favourited recipe
router.post('/recipes/:recipeId/note', auth.isLoggedIn, recipeController.updateFavouriteNote);


// DYNAMIC routes to update/delete recipe

// Get Form to edit recipe
router.get('/recipes/:id/edit', auth.isLoggedIn, recipeController.updateGet)

// Post Form to update recipe
router.post('/recipes/:id/update',auth.isLoggedIn, recipeController.updatePost)

// Post Form to delete recipe
router.post('/recipes/:id/delete', auth.isLoggedIn, recipeController.deletePost);


module.exports = router
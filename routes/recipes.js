const express = require("express");
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const rngController = require('../controllers/rngController');
const auth = require('../middleware/auth-middleware')

// Get and display all recipes from specific user and everyone else when 'Browse Recipes' is clicked
router.get("/recipes", auth.isLoggedIn, recipeController.displayRecipes);

// Get Form to create recipe
router.get('/recipes/create', recipeController.createGet);

// Post Form after filling in the recipe form
router.post('/recipes/create', recipeController.createPost);



// DYNAMIC routes to displayReco/addFav

// GET Form for recommendation
router.get('/recipes/recommendation', rngController.displayReco);

// POST Form for adding to favourites
router.post('/favourites/:recipeId/add', rngController.addFavourite);

// POST Form to add a recipe to favourites from the browse page
router.post('/recipes/:recipeId/favourite', recipeController.addFavouriteFromBrowse);

// GET Form for next recommendation
router.get('/recipes/recommendation/next', rngController.displayNextReco);

// GET Form to clear recommendation when user returns to main recipes page
router.get('/recommendation/clear', rngController.clearReco);

// POST Form for removing from favourites
router.post('/favourites/:recipeId/delete', rngController.removeFavourite);

// GET Form for retrieving one of the Top 3 Rated Recipe
router.get('/recipes/:topRatedId', recipeController.viewTopRated);

// POST Form to add favourite when user in Top Rated Recipe Page
router.post('/recipes/:topRatedId/add', recipeController.addFavouriteFromTopRated);

// POST Form to update a personal note for a favourited recipe
router.post('/recipes/:recipeId/note', recipeController.updateFavouriteNote);


// DYNAMIC routes to update/delete recipe

// Get Form to edit recipe
router.get('/recipes/:id/edit',recipeController.updateGet)

// Post Form to update recipe
router.post('/recipes/:id/update',recipeController.updatePost)

// Post Form to delete recipe
router.post('/recipes/:id/delete', recipeController.deletePost);


module.exports = router
const express = require("express");
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const rngController = require('../controllers/rngController');

// Get and display all recipes from specific user and everyone else when 'Browse Recipes' is clicked
router.get("/recipes", recipeController.displayRecipes);

// Get Form to create recipe
router.get('/recipes/create', recipeController.createGet);

// Post Form after filling in the recipe form
router.post('/recipes/create', recipeController.createPost);



// DYNAMIC routes to displayReco/addFav

// GET Form for recommendation
router.get('/recipes/recommendation', rngController.displayReco);

// POST Form for adding to favourites
router.post('/favourites/:recipeId/add', rngController.addFavourite);

// GET Form for next recommendation
router.get('/recipes/recommendation/next', rngController.displayNextReco);

// POST Form for removing from favourites
router.post('/favourites/:recipeId/delete', rngController.removeFavourite);



// DYNAMIC routes to update/delete recipe

// Get Form to edit recipe
router.get('/recipes/:id/edit',recipeController.updateGet)

// Post Form to update recipe
router.post('/recipes/:id/update',recipeController.updatePost)

// Post Form to delete recipe
router.post('/recipes/:id/delete', recipeController.deletePost);


module.exports = router
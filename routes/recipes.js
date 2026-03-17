const express = require("express");
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// Get and display all recipes from specific user and everyone else when 'Browse Recipes' is clicked
router.get("/recipes", recipeController.displayRecipes);

// Get Form to create recipe
router.get('/recipes/create', recipeController.createGet);

// Post Form after filling in the recipe form
router.post('/recipes/create', recipeController.createPost);

router.get('/recipes/:id/edit',recipeController.updateGet)

router.post('/recipes/:id/update',recipeController.updatePost)

module.exports = router
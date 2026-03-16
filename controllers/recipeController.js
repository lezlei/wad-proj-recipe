
const Recipe = require('../models/Recipe');

// Logic for GET browse-recipe to see user's recipes and everyone's recipe
exports.displayRecipes = async (req,res) => {
    try { 
        const currentUserID = req.session.userId

        if (!currentUserID){
            return res.redirect('/auth/login')
        }

        const userRecipes = await Recipe.findByID(currentUserID);

        const allRecipes = await Recipe.retrieveAll();

        res.render('recipe/browse-recipe', {myRecipes : userRecipes, allRecipes: allRecipes});
    } catch (error) {
        console.error(error);
    };
};

// Logic for GET create-recipe to see form for user to create recipe
exports.createGet = async (req,res) => {
    try {
        const currentUserID = req.session.userId

        if (!currentUserID){
            return res.redirect('/auth/login')
        }

        res.render('recipe/create-recipe')
    } catch (error) {
        console.error(error);
    };
};

// Logic for POST create-recipe to submit form and redirect the user back to browse-recipe
exports.createPost = async (req,res) => {
    try {
        const {title, description, ingredients, instructions} = req.body;

        const currentUserID = req.session.userId;

        if (!currentUserID){
            return res.redirect('/auth/login')
        }

        const ingredientsArray = ingredients.split('\n').filter(line => line.trim() !== '');

        const newRecipe = {
            title : title,
            description : description,
            ingredients : ingredientsArray,
            instructions : instructions,
            authorID : currentUserID
        }

        const addRecipe = await Recipe.addRecipe(newRecipe)
        
        if (addRecipe){
            console.log("Recipe added for user: " + currentUserID);
        }

        res.redirect('/recipes');
    } catch (error) {
        console.error(error)
    };
};


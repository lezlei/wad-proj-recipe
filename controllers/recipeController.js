const User = require('../models/User');
const Recipe = require('../models/Recipe');

// Logic for GET browse-recipe to see user's recipes and everyone's recipe
exports.displayRecipes = async (req, res) => {
  try { 
    const currentUserID = req.session.userId;

    if (!currentUserID) {
      return res.redirect('/auth/login');
    }

    const { search = '', filter = '' } = req.query;

    // Fixed: use Mongoose's find() instead of findByID
    const userRecipes = await Recipe.find({ authorID: currentUserID });

    // Gets user's full profile
    const user = await User.findById(currentUserID).populate({
        path : 'favourites',
        populate : { path : 'authorID' }
    });

    // Get user's favourite from profile
    const favRecipes = user.favourites;

    let allRecipes;

    if (!search) {
      allRecipes = await Recipe.retrieveAll();
    } else if (filter === 'author') {
      const matchedUsers = await User.find({ username: { $regex: search, $options: 'i' } });
      const userIds = matchedUsers.map(u => u._id);
      allRecipes = await Recipe.searchByAuthor(userIds);
    } else if (filter === 'title'){
      allRecipes = await Recipe.searchByTitle(search);
    } else if (filter === 'ingredients') {
      allRecipes = await Recipe.searchByIngredient(search);   
    } else if (filter === 'cuisine') {
        allRecipes = await Recipe.searchByCuisine(search);
    }   

    // Logic for More recipes you may like
    let recommendedRecipes = [];
    
    if (favRecipes.length > 0) {
      const favCuisines = favRecipes.map(recipe => recipe.cuisine);
      
      recommendedRecipes = await Recipe.find({
        cuisine: { $in: favCuisines },
        authorID: { $ne: currentUserID },
        _id: { $nin: favRecipes.map(r => r._id) }
      }).limit(5).populate('authorID');
    } 

    res.render('recipe/browse-recipe', {
      myRecipes: userRecipes,
      favRecipes: favRecipes,
      allRecipes: allRecipes,
      recommendedRecipes: recommendedRecipes,
      user: user,
      search,
      filter
    });

  } catch (error) {
    console.error(error);
    res.redirect('/recipes');
  }
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
        const {title, cuisine, description, ingredients, instructions} = req.body;

        const currentUserID = req.session.userId;

        if (!currentUserID){
            return res.redirect('/auth/login')
        }

        const ingredientsArray = ingredients.split('\n').filter(line => line.trim() !== '');
        const instructionsArray = instructions.split('\n').filter(line => line.trim() !== '');

        const newRecipe = {
            title : title,
            cuisine : cuisine,
            description : description,
            ingredients : ingredientsArray,
            instructions : instructionsArray,
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

// Logic for GET update-recipe to see form for user to edit/update recipe
exports.updateGet = async (req,res)=>{
    try {
        const currentUserID = req.session.userId;

        if(!currentUserID) {
            return res.redirect('/auth/login');
        }

        const recipeId = req.params.id;

        const user = await User.findById(currentUserID);

        // admin bypasses author check
        let existingRecipe;

        if (user.role === 'admin') {
        // admin can find ANY recipe regardless of who owns it
            existingRecipe = await Recipe.findById(recipeId);
        } else {
        // regular user can only find recipes they own
            existingRecipe = await Recipe.findOneRecipe(recipeId, currentUserID);
        }

        if (!existingRecipe) {
            console.log("Recipe not found!");
            return res.redirect('/recipes');
        };

        res.render("recipe/update-recipe", {recipe: existingRecipe});
    } catch (error) {
        console.error(error);
        res.redirect('/recipes');
    }
}

// Logic for POST update-recipe to submit form and redirect user back to browse-recipe
exports.updatePost = async (req,res)=>{
    try {
        const recipeId = req.params.id;
        const {title, cuisine, description, ingredients, instructions} = req.body;
        const currentUserID = req.session.userId;

        if (!currentUserID) {
            return res.redirect('/auth/login');
        }

        const user = await User.findById(currentUserID);

        const ingredientsArray = ingredients.split('\n').filter(line => line.trim() !== '');
        const instructionsArray = instructions.split('\n').filter(line => line.trim() !== '');

        const updatedRecipe = {
            title : title,
            cuisine : cuisine,
            description : description,
            ingredients : ingredientsArray,
            instructions : instructionsArray,
        };

        let updateCheck;
        
        if (user.role === 'admin'){
            updateCheck = await Recipe.findByIdAndUpdate(recipeId, updatedRecipe, { new : true });
        } else {
            updatedRecipe.authorID = currentUserID;
            updateCheck = await Recipe.updateRecipe(recipeId, currentUserID, updatedRecipe);
        };
        
        if (updateCheck) {
            console.log(`${title} recipe updated for user ${currentUserID}`);
            res.redirect("/recipes");
        } else {
            console.log(`${title} recipe does not exist!`);
            res.redirect("/recipes");
        }

    } catch (error) {
        console.error(error);
        res.redirect('/recipes');
    }
}

// Logic for POST delete-recipe to remove a recipe and redirect back to browse-recipe
exports.deletePost = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const currentUserID = req.session.userId;

        if (!currentUserID) {
            return res.redirect('/auth/login');
        }

        const currentUser = await User.findById(currentUserID);
        
        let deleteCheck;

        if (currentUser && currentUser.role === 'admin') {
            deleteCheck = await Recipe.findByIdAndDelete(recipeId);
        } else {
            deleteCheck = await Recipe.deleteRecipe(recipeId, currentUserID);
        }

        if (deleteCheck) {
            console.log(`Recipe deleted by user ${currentUserID} (Admin: ${currentUser.role === 'admin'})`);
        } else {
            console.log(`Recipe does not exist or unauthorized!`);
        }
        
        res.redirect("/recipes");

    } catch (error) {
        console.error(error);
        res.redirect('/recipes');
    }
};

// Logic for POST to add a recipe to favourites from the browse page
exports.addFavouriteFromBrowse = async (req, res) => {
    try {
        const currentUserID = req.session.userId;
        const recipeID = req.params.recipeId;

        if (!currentUserID) {
            return res.redirect('/auth/login');
        }

        const user = await User.findById(currentUserID);
        const alreadyFavourited = user.favourites.includes(recipeID);

        if (!alreadyFavourited) {
            await User.findByIdAndUpdate(currentUserID, {
                $addToSet: { favourites: recipeID }
            });
            console.log(`Recipe added to favourites from browse page!`);
        } else {
            console.log(`Recipe already in favourites!`);
        }

        res.redirect('/recipes');
        
    } catch (error) {
        console.error("Error adding to favourites:", error);
        res.redirect('/recipes');
    }
};
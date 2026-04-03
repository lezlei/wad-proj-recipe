const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Announcement = require('../models/Announcement');

// Logic for GET browse-recipe to see user's recipes and everyone's recipe
exports.displayRecipes = async (req, res) => {
  try { 
    const currentUserID = req.session.userId;

    // Retrieves Banner Announcement Text
    const banner = await Announcement.findOne();


    // Fixed: use Mongoose's find() instead of findByID
    const userRecipes = await Recipe.find({ authorID: currentUserID });


    // Gets user's full profile
    const user = await User.findById(currentUserID).populate({
        path : 'favourites',
        populate : { path : 'authorID' }
    });

    // Get user's favourite from profile
    const favRecipes = user.favourites;


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


    // Retrieves Top 3 Trending Recipes
    let topRated = await Recipe.getTrending();


    // Gets words typed in the search bar from query
    const search = req.query.search || '';

    // Gets filters which are either filter that user chose or just by titles (default)
    const filters = [].concat(req.query.filter || ['title'] );

    let allRecipes;

    // If search bar blank show all recipes, Else show filtered recipes
    if (!search) {
      allRecipes = await Recipe.retrieveAll();
    } else if (filters.length == 0){
      allRecipes = await Recipe.retrieveAll();
    } else {
      allRecipes = await Recipe.searchByFilter(search, filters);
    };

    res.render('recipe/browse-recipe', {
      myRecipes: userRecipes,
      favRecipes: favRecipes,
      favouriteNotes: user.favouriteNotes,
      allRecipes: allRecipes,
      recommendedRecipes: recommendedRecipes,
      topRated: topRated,
      user: user,
      search,
      filters,
      banner    
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

        res.render('recipe/create-recipe', { error : '', oldData: ''})
    } catch (error) {
        console.error(error);
    };
};

// Logic for POST create-recipe to submit form and redirect the user back to browse-recipe
exports.createPost = async (req,res) => {
    try {
        const {title, cuisine, description, common_ingredients, ingredients,  instructions} = req.body;

        const currentUserID = req.session.userId;

        // Get array of ingredients that user input
        let ingredientsArray = ingredients.split('\n').map(line => line.trim()).filter(line => line !== '');

        // Check if user ticked box, combine ingredients ticked + ingredients input
        if (common_ingredients) {
            const checkedArray = Array.isArray(common_ingredients) ? common_ingredients : [common_ingredients];

            ingredientsArray = [...checkedArray, ...ingredientsArray];
        }

        // If they didn't check a box AND didn't type anything
        if (ingredientsArray.length === 0) {
            return res.render('recipe/create-recipe', { error: 'At least one ingredient is required!', oldData: req.body });     
        }

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

        res.render("recipe/update-recipe", {recipe: existingRecipe, oldData: ''});
    } catch (error) {
        console.error(error);
        res.redirect('/recipes');
    }
}

// Logic for POST update-recipe to submit form and redirect user back to browse-recipe
exports.updatePost = async (req,res)=>{
    try {
        const recipeId = req.params.id;
        const {title, cuisine, description, ingredients, common_ingredients, instructions} = req.body;  
        const currentUserID = req.session.userId;

        const user = await User.findById(currentUserID);

        // Get array of ingredients that user input
        let ingredientsArray = ingredients.split('\n').map(line => line.trim()).filter(line => line !== '');

        // Check if user ticked box, combine ingredients ticked + ingredients input
        if (common_ingredients) {
            const checkedArray = Array.isArray(common_ingredients) ? common_ingredients : [common_ingredients];
            ingredientsArray = [...new Set([...checkedArray, ...ingredientsArray])];
        }

        // If they didn't check a box AND didn't type anything
        if (ingredientsArray.length === 0) {    
            const recipe = await Recipe.findById(recipeId);
            return res.render('recipe/update-recipe', { error: true, oldData: req.body, recipe: recipe});     
        }   

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
            res.redirect("/recipes#all-recipes");
        } else {
            console.log(`${title} recipe does not exist!`);
            res.redirect("/recipes#all-recipes");
        }

    } catch (error) {
        console.error(error);
        res.redirect('/recipes#all-recipes');
    }
}

// Logic for POST delete-recipe to remove a recipe and redirect back to browse-recipe
exports.deletePost = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const currentUserID = req.session.userId;

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
        
        res.redirect("/recipes#all-recipes");

    } catch (error) {
        console.error(error);
        res.redirect('/recipes#all-recipes');
    }
};

// Logic for POST to add a recipe to favourites from the browse page
exports.addFavouriteFromBrowse = async (req, res) => {
    try {
        const currentUserID = req.session.userId;
        const recipeID = req.params.recipeId;

        const user = await User.findById(currentUserID);
        const alreadyFavourited = user.favourites.some(fav => fav.toString() === recipeID);

        if (!alreadyFavourited) {
            await User.findByIdAndUpdate(currentUserID, {
                $addToSet: { favourites: recipeID }
            });
            console.log(`Recipe added to favourites from browse page!`);
        } else {
            console.log(`Recipe already in favourites!`);
        }

        const origin = req.query.origin || 'all-recipes';

        res.redirect(`/recipes#${origin}`);
        
    } catch (error) {
        console.error("Error adding to favourites:", error);
        res.redirect('/recipes');
    }
};

// Logic to GET one of the top rated recipes from browse page
exports.viewTopRated = async (req,res) => {
    try {
        const currentUserID = req.session.userId;

        const recipeId = req.params.topRatedId;
        req.session.recipeId = recipeId;

        const randomRecipe = await Recipe.findById(recipeId);
        
        const favmessage = req.session.favmessage;
        req.session.favmessage = null;

        res.render('recipe/topRated-recipe', {randomRecipe, favmessage})

    } catch (err){
        console.error("Error retrieving top rated recipe.", err);
    }
};

// Logic for POST to add a recipe to favourites from the topRated page
exports.addFavouriteFromTopRated = async (req, res) => {
    try {
        const currentUserID = req.session.userId;
        const recipeID = req.session.recipeId;

        const user = await User.findById(currentUserID);
        const alreadyFavourited = user.favourites.some(fav => fav.toString() === recipeID);

        if (alreadyFavourited){
            req.session.favmessage = 'Already added to favourites!'
        } else {
            await User.findByIdAndUpdate(currentUserID, {
                $addToSet : { favourites : recipeID }
            });

            req.session.favmessage = 'Added to favourites!'
        };

        res.redirect(`/recipes/${recipeID}`);
        
    } catch (error) {
        console.error("Error adding to favourites:", error);
        res.redirect('/recipes');
    }
};  

// Logic for POST to update a personal note on a favourited recipe
exports.updateFavouriteNote = async (req, res) => {
    try {
        const currentUserID = req.session.userId;
        const recipeID = req.params.recipeId;
        const newNote = req.body.note;

        const user = await User.findById(currentUserID);

        const existingNoteIndex = user.favouriteNotes.findIndex(n => String(n.recipeId) === String(recipeID));

        if (existingNoteIndex !== -1) {

            user.favouriteNotes[existingNoteIndex].note = newNote;
        } else {

            user.favouriteNotes.push({ recipeId: recipeID, note: newNote });
        }

        await user.save();
        res.redirect('/recipes#my-favourites');
        
    } catch (error) {
        console.error("Error updating note:", error);
        res.redirect('/recipes');
    }
};
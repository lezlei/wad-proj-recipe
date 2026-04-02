## Reviews

Each recipe has a dedicated reviews page where users can share feedback and interact with other reviewers.

### Features

- **Submit a review** — Logged-in users can leave a star rating (1–5) and a comment on any recipe. Each user is limited to one review per recipe.
- **Edit a review** — Users can update their own rating and comment. Admins can edit any review.
- **Delete a review** — Users can delete their own review. Admins can delete any review, or delete all reviews for a recipe at once.
- **Voting** — Users can upvote or downvote reviews. Clicking the same vote again toggles it off. Reviews are sorted by net vote score (upvotes minus downvotes).
- **Replies (threaded comments)** — Users can reply to any review. Replies can be deleted by their author or an admin.
- **Live average score** — The recipe's average rating and review count are automatically recalculated whenever a review is created, updated, or deleted.

### Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/reviews?recipeId=` | View all reviews for a recipe |
| POST | `/reviews` | Submit a new review |
| GET | `/reviews/edit?reviewId=` | Load the edit review form |
| POST | `/reviews/update` | Update an existing review |
| POST | `/reviews/delete` | Delete a review |
| POST | `/reviews/delete-all` | Delete all reviews for a recipe (admin only) |
| POST | `/reviews/vote` | Upvote or downvote a review |
| POST | `/reviews/reply` | Add a reply to a review |
| POST | `/reviews/reply/delete` | Delete a reply |

### Access Control

- Viewing reviews is public.
- Creating, editing, voting, and replying require login.
- Users can only modify or delete their own reviews/replies.
- Admins can modify or delete any review, reply, or all reviews for a recipe.

#########################################################################################################################################################

## Recipes

The Recipe main page is separated into 5 different sections : 
1. My Recipes
2. My Favourites
3. More Recipes You May Like
4. Top Rated Recipes
5. All Recipes

### Features

1. My Recipes
- **Create a recipe** - Users can create their own recipes by pressing on the +Create Link in 'My Recipes' section
- **Update a recipe** - Users can update the recipes that they created by pressing on 'Update' button in the table under 'My Recipes'
- **Delete a recipes** - Users can delete their own recipes by pressing on 'delete' button in the table under 'My Recipes' which also gives them a warning prompt if they really want to delete the recipe

2. My Favourites

3. More Recipes You May Like

4. Top Rated Recipes
- Displays the Top 3 recipes that are sorted by highest review count and highest average rating score
- Users can press on the 'View Recipe' link for each of the top 3 to view each recipe individually
- Users can add the recipe to favourites or view reviews of the recipe

5. All Recipes
- **Search Bar + Filter Checkboxes** - Users can search and filter for specific recipes that they want and the table will dynamically change to display the recipes that the User wants to see. If user did not search anything or did not select any checkbox, the table will just display all recipes created by everyone
- **Random Recipe Generator** - Users can press on "Don't know what to eat? Click Me!" link which redirects them to a random recipe generator page which will show them a recipe that 1. the user did not create 2. the user did not favourite 3. the user have not seen before. When the user lands on the page, they get to add the recipe to favourites by pressing the 'Add to Favourites' button. They get to see the recipe's reviews by clicking on the link 'View Reviews'. When they want another random recipe, they can press on the button 'Get Another Recommendation'. If the user have seen all recipes available to them, the page will show "You have seen all recipes!". The user then have a choice to press on the link 'Start Again' which restarts the random recipe generator and show the user all recipes they had seen before again. The user can also press on the link 'Back to Recipes' which redirects them back to the Recipes main page. 

### Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/recipes` | View all recipes |
| GET | `/recipes/create` | Show create recipe form |
| POST | `/recipes/create` | Submit new recipe |
| GET | `/recipes/recommendation` | Get a random recipe recommendation |
| GET | `/recipes/recommendation/next` | Get the next recommendation |
| GET | `/recommendation/clear` | Clear recommendation session |
| POST | `/favourites/:recipeId/add` | Add recipe to favourites |
| POST | `/favourites/:recipeId/delete` | Remove recipe from favourites |
| POST | `/recipes/:recipeId/favourite` | Add to favourites from browse page |
| GET | `/recipes/:topRatedId` | View a top-rated recipe |
| POST | `/recipes/:topRatedId/add` | Add to favourites from top-rated page |
| POST | `/recipes/:recipeId/note` | Update personal note on a favourited recipe |
| GET | `/recipes/:id/edit` | Show edit recipe form |
| POST | `/recipes/:id/update` | Submit recipe update |
| POST | `/recipes/:id/delete` | Delete a recipe |


### Access Control


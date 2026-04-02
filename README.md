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
- **Create a recipe** - Users can create their own recipes by pressing on the +Create Link in 'My Recipes' section
- **Update a recipe** - Users can update the recipes that they created by pressing on 'Update' button in the table under 'My Recipes'
- **Delete a recipes** - Users can delete their own recipes by pressing on 'delete' button in the table under 'My Recipes' which also gives them a warning prompt if they really want to delete the recipe
- 
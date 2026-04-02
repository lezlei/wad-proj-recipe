# Recipe Website README
<<<<<<< HEAD
=======
- **Prerequisites** - Before running the project, ensure you have the following installed on your machine: Node.js 
1. Open the Project in your Terminal - if using VS Code, open the folder in VS Code and use the integrated terminal
2. Install Dependencies - run 'npm install' 
3. Verify the Environment File - ensure config.env file is present in the main project folder, together with server.js
4. Start the Server - run 'npm start' or 'node server.js'. You should see 'MongoDB connected successfully', 'Server running at http://localhost:3000/' in the terminal.
5. Access the Website - Create an account and enjoy!
>>>>>>> 04317a11d70436e81a99e80a81ae2e1cd65e05d5

## Authentication & User Management

Handles secure user onboarding, session tracking, and route protection across the entire application.

### Features

- **Secure Registration & Login** — Users can create accounts and log in securely. Passwords are encrypted in the database using `bcrypt`.
- **Brute-Force Protection (Rate Limiting)** — The login system tracks failed attempts using anonymous session data. If a user fails to log into a specific username 5 times within a single session, the account is temporarily locked for that session and prompts a password reset. 
- **Profile Management** — Logged-in users can view their profile, update their registered email, or permanently delete their account from the database.
- **Security Middleware** — Implements custom `isLoggedIn` and `isAdmin` middleware to act as bouncers, automatically intercepting and redirecting unauthorized traffic away from protected routes.

### Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/auth/register` | View the registration form |
| POST | `/auth/register` | Register a new user account |
| GET | `/auth/login` | View the login form |
| POST | `/auth/login` | Authenticate user (includes 5-strike rate limiting) |
| GET | `/auth/profile` | View user profile |
| POST | `/auth/profile/update` | Update user email |
| POST | `/auth/profile/delete` | Permanently delete user account |
| GET | `/auth/logout` | Destroy session and log out |

### Access Control
- Register and Login routes are completely public.
- Viewing or modifying a profile requires an active, authenticated user session.

#########################################################################################################################################################

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
- **Create (Add):** - Users can save recipes to 'My Favourites' from multiple locations across the site, including the main Browse page, the Top Rated page, and the Random Recipe Generator.
- **Read (View):** - Users can view all of the favourited recipes in a dedicated, consolidated list under the 'My Favourites' section.
- **Update (Notes):** - Users can add, edit, or overwrite custom personal notes attached to any of their favourited recipes (e.g., to record ingredient substitutions or cooking reminders) via the text field and 'Save Note' button.
- **Delete a favourite** - Users can easily remove a recipe from 'My Favourites' via the 'Remove' button

3. More Recipes You May Like
- **Smart Recommendations** - Provides up to 5 tailored recipe suggestions based on the user's established tastes.
- **Cuisine Matching** - The system automatically analyzes the cuisines of the user's currently favourited recipes and recommends other dishes from those exact same cuisines.
- **Intelligent Filtering** - Automatically filters the suggestions to ensure it never recommends a recipe the user has already authored or already added to their favourites.

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
| POST | `/recipes/create` | Submit new recipe form |
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
- Users can only edit or delete their own recipes
- Admin can edit or delete everyone's recipes

#########################################################################################################################################################

## Admin Panel

The admin panel is a streamlined "Command Center" for admins, designed to handle user permissions and access along with the ability to issue announcements on the website.

### Features

- **Update Users' Roles** - Admins are able to update the roles of all users from "User" to "Admin" and vice versa, granting a user the "Admin" role gives them permission to access the admin panel, as well as the ability to edit/delete any recipe.
- **Ban User** -  Admins are able to toggle ban/unban users in the event it is appropriate to do so (e.g. The user has sent out malicious content onto the website).
- **Delete User** - Admins are able to delete users in the event it is appropriate to do so.
- **Announcement** - Admins are able to issue announcements that will appear on the website's recipe browser in the event the developers need to communicate information to all users. Admins are able to turn off the announcement banner if it is no longer needed.

### Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `auth/admin` | View the admin panel |
| POST | `/auth/update-role` | Update Users' Roles |
| POST | `/auth/toggle-suspend` | Toggle ban/unban a user |
| POST | `/auth/delete` | Delete a user's account |
| POST | `/auth/announcement` | Publish an announcement onto the recipe browser |
| POST | `/auth/deactivate-banner` | Turn off/deactivate the announcement banner |

### Access Control
- Only admins can view/access the admin panel
- Only admins are able to execute the features in the admin panel
- Users will not be able to see the button to access the admin panel

#########################################################################################################################################################

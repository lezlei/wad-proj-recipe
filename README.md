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

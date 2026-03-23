const User = require('../models/User');

exports.getHome = async (req, res) => {
    try {
        let userId = req.session.userId;
        let role = null; // Give everyone a default role of null (guest)

        // 1. Only search the database if they actually have a session ID
        if (userId) {
            // Make sure you have the 'await' here!
            let user = await User.findById(userId);
            
            // 2. Defensive Check: Did the database actually find someone?
            if (user) {
                role = user.role; // Safe to read the role now!
            }
        }

        // 3. Render the page safely
        res.render("index", { 
            userId: req.session.userId, 
            username: req.session.username,
            role: role
        });

    } catch (error) {
        console.error("Error loading home page:", error);
        res.status(500).send("Server Error");
    }
};
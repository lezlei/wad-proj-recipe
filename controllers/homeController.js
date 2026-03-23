const User = require('../models/User');

exports.getHome = async (req, res) => {
    let userId = req.session.userId
    let user = await User.findById(userId)
    console.log(user)
    let role = user.role
    res.render("index", { 
        userId: req.session.userId, 
        username: req.session.username,
        role: role
    });
};
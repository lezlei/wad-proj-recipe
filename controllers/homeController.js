exports.getHome = (req, res) => {
    res.render("index", { 
        userId: req.session.userId, 
        username: req.session.username 
    });
};
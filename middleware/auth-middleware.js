exports.isLoggedIn = (req, res, next) => {
    if (!req.session.userId) {
        console.log("User not logged in, redirecting to /auth/login");
        return res.redirect('/auth/login');
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if (!req.session.userId) {
        console.log("User not logged in, redirecting to /auth/login");
        return res.redirect('/auth/login');
    }
    if (req.session.role !== "admin") {
        console.log("Not an admin user, redirecting to /auth/profile");
        return res.redirect('/auth/profile');
    }
    next();
}
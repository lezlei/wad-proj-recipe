const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.getRegister = (req, res) => {
    res.render('auth/register');
};

exports.postRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.redirect('/auth/login');
    } catch (err) {
        console.log(err);
        res.send("Registration failed.");
    }
};

exports.getLogin = (req, res) => {
    res.render('auth/login', { error: null });
};

exports.postLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });

        // Username not found
        if (!user) {
            return res.render('auth/login', { error: "Username not found." });
        }

        if (!req.session.loginAttempts) {
            req.session.loginAttempts = {};
        }

        // Check if max attempts reached
        if (req.session.loginAttempts[username] >= 5) {
            return res.render('auth/login', { error: "Maximum login attempts reached. Please reset your password by contacting admin at luochuan@gmail.com" });
        }

        // Check if user is suspended
        if (user.isSuspended === true) {
            return res.render('auth/login', { error: "Your account has been banned!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            delete req.session.loginAttempts[username];
            req.session.userId = user._id;
            req.session.username = user.username;
            req.session.role = user.role;
            res.redirect('/');
        } else {
            // Wrong password -> increase attempt counter
            req.session.loginAttempts[username] = (req.session.loginAttempts[username] || 0) + 1;
            
            if (req.session.loginAttempts[username] >= 5) {
                return res.render('auth/login', { error: "Maximum login attempts reached. Please reset your password through email." });
            }
            
            // Re-render the page and inject the attempts left
            return res.render('auth/login', { 
                error: `Incorrect password. Attempts left: ${5 - req.session.loginAttempts[username]}` 
            });
        }
        
    } catch (err) {
        console.log(err);
        res.render('auth/login', { error: "Error during login." });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) return res.send("User not found");
        
        res.render('auth/profile', { user: user });
    } catch (err) {
        console.log(err);
        res.send("Error loading profile.");
    }
};

exports.postUpdateProfile = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.session.userId, { email: req.body.email });
        res.redirect('/auth/profile');
    } catch (err) {
        console.log(err);
        res.send("Update failed");
    }
};

exports.postDeleteProfile = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.session.userId);
        req.session.destroy((err) => {
            if (err) return res.send("Error logging out after deletion.");
            res.redirect('/');
        });
    } catch (err) {
        console.log(err);
        res.send("Delete failed");
    }
};

exports.getLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.send("Error logging out.");
        res.redirect('/'); 
    });
};

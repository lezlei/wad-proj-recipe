const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt'); 

// GET Registration webpage
router.get('/register', (req, res) => {
    res.render('auth/register');
});

// POST Registration
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    // Use bcrypt to hash the password before saving
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.send("Error hashing password.");
        }

        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword // Save the hashed version
        });

        // Save to MongoDB
        newUser.save((err) => {
            if (err) {
                console.log(err);
                res.send("Registration failed. Check for duplicate username/email.");
            } else {
                res.redirect('/auth/login');
            }
        });
    });
});

// GET Login webpage
router.get('/login', (req, res) => {
    res.render('auth/login');
});

// POST Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if user exists
    User.findOne({ username: username }, (err, user) => {
        if (err || !user) {
            return res.send("Invalid username or password.");
        }

        // Compare inputted password with hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.send("Error during login.");
            }

            if (isMatch) {
                // "Save" their session login
                req.session.userId = user._id; 
                res.redirect('/');
            } else {
                res.send("Invalid username or password.");
            }
        });
    });
});

module.exports = router;
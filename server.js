const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session"); 
const path = require("path");

const app = express();

// SETTINGS & MIDDLEWARE
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "smu-is113-secret-key",
  resave: false,
  saveUninitialized: false
}));

// MongoDB CONNECTION
const dbURI = "mongodb+srv://db_user:wadrecipe@wad-recipe-proj.xa42ecg.mongodb.net/WAD-recipe-proj?appName=WAD-recipe-proj";
mongoose.connect(dbURI)
  .then(() => console.log("MongoDB Connected to Atlas"))
  .catch(err => console.log("DB Connection Error:", err));

// ROUTES
const authRoutes = require('./routes/auth');
const homeRoutes = require('./routes/home'); 
app.use('/', homeRoutes);
app.use('/auth', authRoutes);

// START SERVER
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
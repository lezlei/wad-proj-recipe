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
  .then(() => console.log("✅ MongoDB Connected to Atlas"))
  .catch(err => console.log("❌ DB Connection Error:", err));

// ROUTES
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes); // User authentication logic

app.get("/", (req, res) => {
    // Pass userId so EJS can see if someone is logged in
    res.render("index", { userId: req.session.userId });
});

// START SERVER
app.listen(8000, () => {
    console.log("🚀 Server running on port 8000");
});
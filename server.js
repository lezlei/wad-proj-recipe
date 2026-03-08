const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session"); 
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "smu-is113-secret-key",
  resave: false,
  saveUninitialized: false
}));

app.get("/", (req, res) => {
    res.send("Recipe App Running.");
});

const dbURI = "mongodb+srv://db_user:wadrecipe@wad-recipe-proj.xa42ecg.mongodb.net/WAD-recipe-proj?appName=WAD-recipe-proj";

mongoose.connect(dbURI)
  .then(() => console.log("✅ MongoDB Connected to Atlas"))
  .catch(err => console.log("❌ DB Connection Error:", err));

app.listen(8000, () => {
    console.log("🚀 Server running on port 8000");
});
 const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.send("Recipe App Running");
});

mongoose.connect("mongodb://127.0.0.1:27017/recipeApp")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.listen(8000, () => {
    console.log("Server running on port 8000");
});

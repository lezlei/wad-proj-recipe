const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe")

router.get("/", async (req, res) => {
    const recipes = await Recipe.find();
    res.render("recipes/index", { recipes })
});

router.get("/new", (req, res) => {
    res.render("recipes/new")
});

module.exports = router
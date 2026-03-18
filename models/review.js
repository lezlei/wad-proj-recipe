const mongoose= require("mongoose");

// create schema
const reviewSchema = new mongoose.Schema({
    user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
    },
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
        required: true
    },
    rating: {
        type: Number,
        min:1,
        max:5,
        required: true
    },
    comment: {
        type: String,
        required: true
    }},
    { timestamps: true});

module.exports=mongoose.model("Review",reviewSchema);
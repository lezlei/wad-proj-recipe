const mongoose= require("mongoose");

// create schema
const reviewSchema = new mongoose.Schema({
    user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
    },
    votes: {
    type: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        value: { type: Number, enum: [1, -1] }
        }],
    default: []
    },
    replies: [
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }
    ]},
    { timestamps: true});

module.exports=mongoose.model("Review",reviewSchema);
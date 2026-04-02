const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    // For authorisation
    role: { 
        type: String, 
        default: 'user' 
    },
    dateJoined: { 
        type: Date, 
        default: Date.now 
    },
    isSuspended: {
        type: Boolean,
        default: false
    },
    // Record User's favourited recipes 
    favourites: [
        { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Recipe' 
        }
    ],
    favouriteNotes: [
        {
        recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
        note: { type: String, default: '' }
        }
    ]
});

module.exports = mongoose.model('User', userSchema);
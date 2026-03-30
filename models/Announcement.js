const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    content: String,
    isActive : { type: Boolean, default: true }
});

module.exports = mongoose.model('Announcement', announcementSchema);
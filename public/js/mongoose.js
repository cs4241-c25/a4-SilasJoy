const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
    chips: Number,
    mult: Number,
    stake: String,
    deck: String,
    score: Number,
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }  // Reference to the user who created this entry
});

const Entry = mongoose.model('Entry', entrySchema);
module.exports = Entry;

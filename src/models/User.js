const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    user_id: {type: String, required: true},
    playlists: []
});

const User = mongoose.model('User', userSchema);

module.exports = User;

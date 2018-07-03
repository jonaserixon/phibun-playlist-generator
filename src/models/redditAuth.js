const mongoose = require('mongoose');

const redditAuthSchema = mongoose.Schema({
    access_token: {type: String},
    expire_at: {type: Date, default: Date.now, expires: 3600} 
});

const RedditAuth = mongoose.model('RedditAuth', redditAuthSchema);

module.exports = RedditAuth;

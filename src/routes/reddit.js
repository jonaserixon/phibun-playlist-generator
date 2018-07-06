const router = require('express').Router();
const request = require('request-promise-native');

const {
    getAccessToken, 
    removeExistingAccessToken, 
    getTracksFromReddit, 
    sortTracksFromReddit, 
    randomTracklist,
    searchSpotify,
    createPlaylist,
    getPlaylists,
    replaceTracksPlaylist
    } = require('./handlers');

const RedditModel = require('../models/redditAuth').model('RedditAuth');

const client_secret = process.env['REDDIT_SECRET'];
const client_id = process.env['REDDIT_ID'];

router.get('/auth', async (req, res) => {
    const options = {
        url: 'https://www.reddit.com/api/v1/access_token',
        form: {
            grant_type: 'client_credentials'
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')),
            'User-Agent': process.env['REDDIT_USER_AGENT']
        },
        method: 'POST',
        json: true
    }

    try {
        const parsedBody = await request(options);
        await removeExistingAccessToken(RedditModel);
        const token = new RedditModel({access_token: parsedBody.access_token});
        token.save((err) => {
            if (!err) res.status(200).json(parsedBody);
        });
        
    } catch(err) { 
        res.status(401).json(err) 
    }
});

router.post('/phicloud-playlist', async (req, res) => {
    const access_token = req.body.access_token;
    const user_id = req.body.user_id;

    try {
        const tracks = await getTracksFromReddit(await getAccessToken(RedditModel));
        const sorted = sortTracksFromReddit(tracks);
        const searchResult = await searchSpotify(sorted, access_token);
        const doesPlaylistExist = await getPlaylists(access_token);
        if (doesPlaylistExist.length < 1) await createPlaylist(user_id, access_token);
        const playlist = await getPlaylists(access_token);  //fult som fan
        await replaceTracksPlaylist(playlist[0].id, user_id, access_token, searchResult);

        res.status(200).json(searchResult);
    } catch(err) { 
        console.log(err);
        res.status(401).json(err);
    }
}); 

module.exports = router;

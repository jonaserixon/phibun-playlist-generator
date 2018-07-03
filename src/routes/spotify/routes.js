const router = require('express').Router();
const request = require('request-promise-native');

const client_secret = process.env['SPOTIFY_SECRET'];
const client_id = process.env['SPOTIFY_ID'];

const baseUrl = 'https://api.spotify.com/v1/';

router.post('/login', async (req, res) => {
    const options = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: req.body.code,
            redirect_uri: 'http://localhost:3000/callback',
            grant_type: "authorization_code"
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        method: 'POST',
        json: true
    }

    try {
        const parsedBody = await request(options);
        const access_token = parsedBody.access_token;
        //Spara refresh token på backend
        const refresh_token = parsedBody.refresh_token;
        res.status(200).json({ message: 'Login successful', access_token, refresh_token });
    } catch(error) {
        res.status(400).json({ message: 'Bad login' });
    }
    
});

router.post('/refresh-token', async (req, res) => {
    //refresh token request
});

router.post('/user-info', async (req, res) => {
    const options = {
        url: baseUrl + 'me',
        headers: {
            'Authorization': 'Bearer ' + req.body.access_token
        },
        method: 'GET',
        json: true
    };

    try {
        const parsedBody = await request(options);
        res.status(200).json(parsedBody);
    } catch(error) { 
        res.status(401).json(error) 
    }
});

router.post('/get-playlists', async (req, res) => {
    const options = {
        url: baseUrl + 'me/playlists',
        headers: {
            'Authorization': 'Bearer ' + req.body.access_token
        },
        method: 'GET',
        json: true
    };

    try {
        const parsedBody = await request(options);
        const appPlaylist = parsedBody.items.filter((playlist) => playlist.name === 'PhiCloud - Weekly Hits');
        res.status(200).json(appPlaylist);
    } catch(error) {
        res.status(401).json(error) 
    }
});

module.exports = router;

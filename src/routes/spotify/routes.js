const router = require('express').Router();
const request = require('request-promise-native');

const client_secret = process.env['SPOTIFY_SECRET'];
const client_id = process.env['SPOTIFY_ID'];

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

    let parsedBody = await request(options);
    let access_token = parsedBody.access_token;

    //Spara refresh token på backend
    let refresh_token = parsedBody.refresh_token;

    console.log(parsedBody)
    res.status(200).json({ message: 'Login successful', access_token, refresh_token });
});

router.post('/refresh-token', async (req, res) => {
    //refresh token request
});

router.post('/user-info', async (req, res) => {
    console.log(req.body.access_token);
    console.log('_______________________')
    const options = {
        url: 'https://api.spotify.com/v1/me',
        headers: {
            'Authorization': 'Bearer ' + req.body.access_token
        },
        method: 'GET',
        json: true
    }

    let parsedBody = await request(options);
    console.log(parsedBody);

    res.status(200).json(parsedBody);
});

module.exports = router;

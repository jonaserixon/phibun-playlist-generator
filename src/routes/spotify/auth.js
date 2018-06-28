const router = require('express').Router();

const client_id = process.env['ID'];
const client_secret= process.env['SPOTIFY_SECRET'];
const scopes = 'user-read-private user-read-email';
const redirect_uri = '';

router.get('/callback', (req, res) => {
    console.log('Spotify Callback route.')
    res.status(200).json({ message: 'Spotify Callback route.' });
});

router.get('/login', (req, res) => {
    //Send to Spotify /authorize endpoint, passing to it the client ID, scopes, and redirect URI.
    console.log('Login request received.')
    res.status(200).json({ message: 'Login request received.' });
});

module.exports = router;

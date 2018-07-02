const router = require('express').Router();
const request = require('request-promise-native');

const client_secret = process.env['REDDIT_SECRET'];
const client_id = process.env['REDDIT_ID'];

const baseUrl = 'https://oauth.reddit.com';

router.get('/auth', async (req, res) => {
    const options = {
        url: 'https://www.reddit.com/api/v1/access_token',
        method: 'POST',
        form: {
            grant_type: 'client_credentials'
        },
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        }
    }

    try {
        const parsedBody = await request(options);
        res.status(200).json(parsedBody);
    } catch(error) { 
        res.status(401).json(error) 
    }
});

router.post('/callback', async (req, res) => {
    res.json({message: 'Reddit callback route'})
});

module.exports = router;

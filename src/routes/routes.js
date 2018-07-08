const router = require('express').Router();
const request = require('request-promise-native');

const RedditModel = require('../models/RedditAuth').model('RedditAuth');
const UserModel = require('../models/User').model('User'); 

const {
    getAccessToken, 
    removeExistingAccessToken, 
    getTracksFromReddit, 
    sortTracksFromReddit, 
    randomTracklist,
    searchSpotify,
    createPlaylist,
    getPlaylists,
    addTracksToPlaylist,
    createRedditAccessToken,
    savePlaylistinDB
    } = require('./handlers');


const baseUrl = 'https://api.spotify.com/v1/';

router.post('/auth', async (req, res) => {
    const options = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: req.body.code,
            redirect_uri: 'http://localhost:3000/callback',
            grant_type: "authorization_code"
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(process.env['SPOTIFY_ID'] + ':' + process.env['SPOTIFY_SECRET']).toString('base64'))
        },
        method: 'POST',
        json: true
    }

    try {
        const parsedBody = await request(options);
        const access_token = parsedBody.access_token;
        const refresh_token = parsedBody.refresh_token;

        res.status(200).json({ message: 'Auth successful', access_token, refresh_token });
    } catch(error) {
        res.status(400).json({ message: 'Bad auth' });
    }
    
});

router.post('/refresh-token', async (req, res) => {
    //refresh token request
});

//Stores new users in database
router.post('/user', async (req, res) => {
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

        UserModel.findOne({user_id: parsedBody.id}, (err, result) => {
            if (result == null) {
                let user = new UserModel({
                    user_id: parsedBody.id
                });
                user.save((err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('stored new user')
                    }
                })
            } else {
                console.log(parsedBody.id + ' already exists!');
            }
        })

        res.status(200).json(parsedBody);
    } catch(error) { 
        res.status(401).json(error) 
    }
});

router.post('/playlists', async (req, res) => {
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
        const phiPlaylist = parsedBody.items.filter((playlist) => playlist.name === 'PhiCloud');
        
        const options2 = {
            url: phiPlaylist[0].tracks.href,
            headers: {
                'Authorization': 'Bearer ' + req.body.access_token
            },
            method: 'GET',
            json: true
        };

        const parsedPlaylist = await request(options2);

        let tracklist = parsedPlaylist.items.map((track) => {
            let object = {
                artist: track.track.artists[0].name,
                title: track.track.name,
                album_name: track.track.album.name,
                album_art: track.track.album.images[0].url,            
                duration: millisToMinutesAndSeconds(track.track.duration_ms),
                uri: track.track.uri,
            }

            return object;
        })

        res.status(200).json({playlist: phiPlaylist, tracklist: tracklist});
    } catch(error) {
        res.status(401).json(error) 
    }
});

millisToMinutesAndSeconds = (millis) => {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

//COMMON
router.post('/generate-playlist', async (req, res) => {
    const access_token = req.body.access_token;
    const user_id = req.body.user_id;

    try {
        const tracks = await getTracksFromReddit(await getAccessToken(RedditModel));
        const sorted = sortTracksFromReddit(tracks);
        const searchResult = await searchSpotify(sorted, access_token, 10);
        const createdPlaylist = await createPlaylist(user_id, access_token, req.body.playlist_name);
        await addTracksToPlaylist(createdPlaylist.id, user_id, access_token, searchResult);
        await savePlaylistinDB(UserModel, createdPlaylist.id, user_id);

        res.status(200).json(searchResult);
    } catch(err) {
        console.log(err);
        res.status(401).json(err);
    }
});


router.post('/replace-track', async (req, res) => {
    const access_token = req.body.access_token;
    const user_id = req.body.user_id;

    try {
        //Ska generera en ny låt i spellistan och "replaca" låten 
    } catch(err) {

    }
});

router.post('/library-playlists', (req, res) => {
    const access_token = req.body.access_token;
    const user_id = req.body.user_id;

    console.log(user_id);

    return UserModel.findOne({user_id})
        .exec()
        .then(async (user) => {
            //gör en massa requests till spotify apiet med playlist id från user.playlists
            //kolla ifall spellsitorna fortfarande existerar eller inte och isåfalls ta bort från dbn
            const userPlaylists = await getPlaylists(access_token, user_id, user.playlists);
            res.status(200).json(userPlaylists);
        })
        .catch((err) => {
            res.status(400).json(err);
        });
});

module.exports = router;

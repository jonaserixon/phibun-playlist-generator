const router = require('express').Router();
const request = require('request-promise-native');

const mongoose = require('mongoose');
const RedditModel = require('../../models/redditAuth').model('RedditAuth');

const client_secret = process.env['REDDIT_SECRET'];
const client_id = process.env['REDDIT_ID'];

const baseUrl = 'https://oauth.reddit.com/';

router.get('/auth', async (req, res) => {
    const options = {
        url: 'https://www.reddit.com/api/v1/access_token',
        form: {
            grant_type: 'client_credentials'
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')),
            'User-Agent': 'webapp:phicloud (by /u/ingen_alls)'
        },
        method: 'POST',
        json: true
    }

    try {
        const parsedBody = await request(options);

        await removeExistingAccessToken();

        const token = new RedditModel({access_token: parsedBody.access_token});
        token.save((err) => {
            if (!err) res.status(200).json(parsedBody);
        });
        
    } catch(err) { 
        res.status(401).json(err) 
    }
});

router.post('/callback', async (req, res) => {
    res.json({message: 'Reddit callback route'})
});

router.post('/phicloud-playlist', async (req, res) => {
    //Hämta alla låtar från reddit
    //Filtrera ut låtar
    //Sök efter låtarna på Spotify
    //CRUD playlist
    const access_token = req.body.access_token;
    const user_id = req.body.user_id;

    try {
        const tracks = await collector();
        const sorted = sorter(tracks);
        const searchResult = await searchSpotify(sorted, access_token);
        const doesPlaylistExist = await getPlaylist(access_token);
        if (doesPlaylistExist.length < 1) {
            await createPlaylist(user_id, access_token);
        }

        

        res.status(200).json(searchResult);
    } catch(err) { 
        res.status(401).json(err) 
    }
});

function getAccessToken() {
    return (
        RedditModel.find({})
        .exec()
        .then((token) => {
            return token[0].access_token;
        }).catch((err) => {
            console.log(err);
        })
    )
}

function removeExistingAccessToken() {
    return (
        RedditModel.find({})
        .exec()
        .then((token) => {
            if (token.length > 0) token[0].remove();
        }).catch((err) => {
            console.log(err);
        })
    )
}

function createOptions(access_token, url) {
    const options = {
        url: baseUrl + url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + access_token,
            'User-Agent': 'webapp:phicloud (by /u/ingen_alls)'
        },
        method: 'GET',
        json: true
    }

    return options;
}

async function collector() {
    //Collect songs from multiple subreddits
    const access_token = await getAccessToken();

    try {
        return new Promise(async resolve => {
            const listentothis = await request(createOptions(access_token, 'r/listentothis/hot?limit=25'));
            const music = await request(createOptions(access_token, 'r/music/hot?limit=25'));

            let tracks = [];

            listentothis.data.children.map((track) => {
                tracks.push(track.data);
            })

            music.data.children.map((track) => {
                tracks.push(track.data);
            })
            
            resolve(tracks);
            return tracks;
        })
    } catch(err) {
        console.log(err);
    }
}

function sorter(tracks) {
    //Sort all the tracks from collector() based on whether it is a YouTube link or not
    const sorted = tracks.filter((post) => post.domain === 'youtube.com');

    let trackList = [];

    sorted.map((track) => {
        let genre;
        let year;

        if (track.title.match(/\[(.*?)\]/)) {
            genre = track.title.match(/\[(.*?)\]/)[1];
        }

        if (track.title.match(/\(([^)]+)\)/)) {
            year = track.title.match(/\(([^)]+)\)/)[1];
            if (!/\d/.test(year)) year = null;
        }        
        
        let object = {
            title: track.title.substring(0, track.title.indexOf('[')),
            year,
            genre
        };

        trackList.push(object);
    })
    return trackList;
}

//SPOTIFY
function searchSpotify(tracks, access_token) {
    const promises = tracks.map((track) => {
        return new Promise(async (resolve, reject) => {
            const options = {
                url: 'https://api.spotify.com/v1/search',
                qs: {
                    q: track.title,
                    type: 'track',
                    limit: 1
                },
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                method: 'GET',
                json: true
            };

            const parsedTrack = await request(options);
            resolve(parsedTrack.tracks.items[0]);
        })
    })

    return Promise.all(promises)
        .then((result) => {
            console.log(result);
            return result;
        }).catch((err) => {
            console.log(err);
        })
}

async function createPlaylist(user_id, access_token) {
    const options = {
        url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/',
        body: {
            name: 'PhiCloud - Weekly Hits',
        },
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token
        },
        method: 'POST',
        json: true
    };

    try {
        await request(options);
        console.log('created spotify playlist')
    } catch(err) {
        console.log('err')
    }
}

async function getPlaylist(access_token) {
    const options = {
        url: 'https://api.spotify.com/v1/me/playlists',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        method: 'GET',
        json: true
    };

    try {
        const parsedBody = await request(options);
        const appPlaylist = parsedBody.items.filter((playlist) => playlist.name === 'PhiCloud - Weekly Hits');
        return appPlaylist;
    } catch(err) {
        console.log(err);
    }
}

async function addTracksPlaylist() {

}

async function replaceTracksPlaylist() {

}

module.exports = router;

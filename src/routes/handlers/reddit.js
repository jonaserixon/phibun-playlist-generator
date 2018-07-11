const request = require('request-promise-native');
const {randomTracklist} = require('../utils/utils');

const createRedditAccessToken = async (RedditModel) => {
    const options = {
        url: 'https://www.reddit.com/api/v1/access_token',
        form: {
            grant_type: 'client_credentials'
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer(process.env['REDDIT_ID'] + ':' + process.env['REDDIT_SECRET']).toString('base64')),
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
            if (!err) console.log('reddit token stored in db');
        });

        return parsedBody.access_token;
    } catch(err) { 
        throw new Error(err);
    }
}

const getAccessToken = (RedditModel) => {
    return (
        RedditModel.find({})
        .exec()
        .then(async (token) => {
            if (token[0] === undefined) {
                return await createRedditAccessToken(RedditModel);
            } else {
                return token[0].access_token;
            }
        }).catch((err) => {
            throw new Error(err);
        })
    )
}

const removeExistingAccessToken = (RedditModel) => {
    return (
        RedditModel.find({})
        .exec()
        .then((token) => {
            if (token.length > 0) token[0].remove();
            console.log('removed reddit token from db')
        }).catch((err) => {
            throw new Error(err);
        })
    )
}

const getTracksFromReddit = async (access_token) => {
    try {
        const options1 = {
            url: 'https://oauth.reddit.com/r/listentothis/top?t=day&limit=100',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + access_token,
                'User-Agent': process.env['REDDIT_USER_AGENT']
            },
            method: 'GET',
            json: true
        }

        const options2 = {
            url: 'https://oauth.reddit.com/r/music/top?t=day&limit=100',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + access_token,
                'User-Agent': process.env['REDDIT_USER_AGENT']
            },
            method: 'GET',
            json: true
        }

        const listentothis = await request(options1);
        const music = await request(options2);

        let tracks = [];

        listentothis.data.children.map((track) => {
            tracks.push(track.data);
        })

        music.data.children.map((track) => {
            tracks.push(track.data);
        })
        
        return tracks;
    } catch(err) {
        throw new Error(err);
    }
}

const sortTracksFromReddit = (tracks) => {
    const tracklist = tracks.filter((post) => post.domain === 'youtube.com');

    let sorted = [];

    tracklist.map((track) => {
        let genre;
        let year;

        if (track.title.match(/\[(.*?)\]/)) {
            genre = track.title.match(/\[(.*?)\]/)[1];
        }

        if (track.title.match(/\(([^)]+)\)/)) {
            year = track.title.match(/\(([^)]+)\)/)[1];
            if (!/\d/.test(year)) year = null;
        }        
        
        const object = {
            title: track.title.substring(0, track.title.indexOf('[')),
            year,
            genre
        };

        sorted.push(object);
    })
    
    return randomTracklist(30, sorted);
}

module.exports = {
    createRedditAccessToken,
    getAccessToken,
    removeExistingAccessToken,
    getTracksFromReddit,
    sortTracksFromReddit
};

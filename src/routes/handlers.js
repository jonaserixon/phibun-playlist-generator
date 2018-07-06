const request = require('request-promise-native');

const getAccessToken = (RedditModel) => {
    //Om den inte hittar en token så gör en request till /auth
    return (
        RedditModel.find({})
        .exec()
        .then((token) => {
            return token[0].access_token;
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
        }).catch((err) => {
            throw new Error(err);
        })
    )
}

const createOptions = (access_token, url) => {
    const options = {
        url: 'https://oauth.reddit.com/' + url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + access_token,
            'User-Agent': process.env['REDDIT_USER_AGENT']
        },
        method: 'GET',
        json: true
    }

    return options;
}

const getTracksFromReddit = async (access_token) => {
    try {
        return new Promise(async resolve => {
            const listentothis = await request(createOptions(access_token, 'r/listentothis/top?t=day&limit=100'));
            const music = await request(createOptions(access_token, 'r/music/top?t=day&limit=100'));

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
    
    return randomTracklist(50, sorted);
}

const randomTracklist = (count, array) => {
    const tmp = array.slice(array);
    const tracks = [];
    
    for (let i = 0; i < count; i++) {
        const index = Math.floor(Math.random() * tmp.length);
        const removed = tmp.splice(index, 1);
        tracks.push(removed[0]);
    }
    return tracks;
}

const searchSpotify = (tracks, access_token) => {
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

            try {
                const parsedTrack = await request(options);
                if (parsedTrack.tracks.items[0] !== undefined && parsedTrack.tracks.items[0]) {
                    resolve(parsedTrack.tracks.items[0].uri);
                } else {
                    resolve(parsedTrack.tracks.items[0]);
                }
            } catch(err) {
                reject(err);
            }
        })
    })

    return Promise.all(promises)
        .then((result) => {
            const uris = result.filter(uri => uri);
            return randomTracklist(10, uris);
        }).catch((err) => {
            throw new Error(err);
        })
}

const createPlaylist = async (user_id, access_token) => {
    const options = {
        url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/',
        body: {
            name: 'PhiCloud',
            public: false,
            description: 'A PhiCloud generated playlist!'
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
        throw new Error(err);
    }
}

const getPlaylists = async (access_token) => {
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
        const appPlaylist = parsedBody.items.filter((playlist) => playlist.name === 'PhiCloud');
        return appPlaylist;
    } catch(err) {
        throw new Error(err);
    }
}

const replaceTracksPlaylist = async (playlist_id, user_id, access_token, tracks) => {
    const options = {
        url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks',
        body: {
            uris: tracks
        },
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token
        },
        method: 'PUT',
        json: true
    };

    try {
        await request(options);
        console.log('successfully added tracks to playlist! =)');
        return {
            status: 201
        };
    } catch(err) {
        throw new Error(err);
    }
}

module.exports = {
    getAccessToken,
    removeExistingAccessToken,
    getTracksFromReddit,
    sortTracksFromReddit,
    randomTracklist,
    searchSpotify,
    createPlaylist,
    getPlaylists,
    replaceTracksPlaylist
}

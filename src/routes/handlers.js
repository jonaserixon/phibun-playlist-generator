const request = require('request-promise-native');

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
    
    return randomTracklist(30, sorted);
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

const searchSpotify = (tracks, access_token, count) => {
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
            return randomTracklist(count, uris);
        }).catch((err) => {
            throw new Error(err);
        })
}

const createPlaylist = async (user_id, access_token, name) => {
    const options = {
        url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/',
        body: {
            name,
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
        const parsedBody = await request(options);
        console.log(parsedBody.id);
        console.log('created spotify playlist')
        return parsedBody;
    } catch(err) {
        throw new Error(err);
    }
}

const savePlaylistinDB = (UserModel, playlist_id, user_id) => {
    return UserModel.findOne({user_id})
        .exec()
        .then((user) => {
            console.log(user);
            if (user.playlists.includes(playlist_id)) {
                console.log('User already has stored this playlist in the DB');
            } else {
                user.playlists.push(playlist_id);
                user.save((err, result) => {
                    if (!err) console.log('Playlist (' + playlist_id + ') successfully saved in ' + user_id + '\' playlist library!');
                })
            }
        })
        .catch((err) => {
            console.log(err);
        })
}

const getPlaylists = async (access_token, user_id, playlists) => {
    const promises = playlists.map((playlist) => {
        
        return new Promise(async (resolve, reject) => {
            const options = {
                url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist,
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                method: 'GET',
                json: true
            };
            
            try {
                const parsedPlaylist = await request(options);
                resolve(parsedPlaylist);
            } catch(err) {
                reject(err);
            }
        })
    })

    return Promise.all(promises)
        .then((result) => {
            console.log(result);
            return result;
        }).catch((err) => {
            throw new Error(err);
        })

}

const addTracksToPlaylist = async (playlist_id, user_id, access_token, tracks) => {
    const options = {
        url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks',
        body: {
            uris: tracks
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
    addTracksToPlaylist,
    createRedditAccessToken,
    savePlaylistinDB
}

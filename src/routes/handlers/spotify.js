const request = require('request-promise-native');
const {randomTracklist, millisToMinutesAndSeconds} = require('../utils/utils');

const auth = async (code) => {
    const options = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code,
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

        return {access_token, refresh_token};
    } catch(err) {
        throw new Error(err);
    }
}

const getUserInfo = async (access_token) => {
    const options = {
        url: 'https://api.spotify.com/v1/me',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        method: 'GET',
        json: true
    };

    try {
        const parsedBody = await request(options);
        return parsedBody;
    } catch(err) {
        throw new Error(err);
    }
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
    const options = {
        url: 'https://api.spotify.com/v1/me/playlists',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        method: 'GET',
        json: true
    };
    
    try {
        const parsedPlaylists = await request(options);
        let playlistsOwnedByUser = parsedPlaylists.items.filter((playlist) => playlist.owner.id === user_id);

        let existingPlaylists = [];

        playlistsOwnedByUser.map((x) => {
            playlists.map((y) => {
                if (x.id === y) existingPlaylists.push(x);
            })
        })

        return existingPlaylists;
    } catch(err) {
        throw new Error(err);
    }
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
    auth,
    getUserInfo,
    searchSpotify,
    createPlaylist,
    getPlaylists,
    addTracksToPlaylist,
    savePlaylistinDB
}

import React, { Component } from 'react';
import {Grid, Row, Col, Button} from 'react-bootstrap';
import {requestOptions} from '../helpers/requestOptions';
import Playlist from './playlist';

class Library extends Component {
    constructor(props) {
        super(props);

        this.state = {
            playlists: [],
            list: []
        };
    }

    async componentWillMount() {
        const data = { 
            access_token: localStorage.getItem('access_token'),
            user_id: this.props.username,
        };

        const response = await fetch('/api/library-playlists', requestOptions(data, 'POST'));
        const json = await response.json();
        // console.log(json);
        this.setState({playlists: json});
        this.getSpotifyPlaylists();
    }

    getSpotifyPlaylists() {
        let lists = [];
        this.state.playlists.map((playlist) => {
            lists.push(
                <Playlist name={playlist.name} totalTracks={playlist.tracks.total} tracks={playlist.tracks.href} externalUrl={playlist.external_urls.spotify}/>
            );
        })
        this.setState({list: lists});
    }
    
    render() {
        return (
            <div className="Library">
                <div>
                    <h3>Your PhiCloud-Generated Playlists!</h3>
                    {this.state.list}
                </div>
            </div>
        );
    }
}

export default Library;

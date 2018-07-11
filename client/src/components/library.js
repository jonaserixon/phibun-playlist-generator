import React, { Component } from 'react';
import {Tabs, Tab} from 'react-bootstrap';

import {requestOptions} from '../helpers/requestOptions';
import Playlist from './playlist';

class Library extends Component {
    constructor(props) {
        super(props);

        this.state = {
            playlists: [],
            list: [],
            key: 1
        };

        this.handleTabs = this.handleTabs.bind(this);
    }

    handleTabs(key) {
        this.setState({ key });
    }

    async componentWillMount() {
        const data = { 
            access_token: localStorage.getItem('access_token'),
            user_id: this.props.username,
        };

        const response = await fetch('/api/library-playlists', requestOptions(data, 'POST'));
        const json = await response.json();
        this.setState({playlists: json});
        this.getSpotifyPlaylists();
    }

    getSpotifyPlaylists() {
        let lists = [];
        this.state.playlists.map((playlist, i) => 
            lists.push(
                <Tab eventKey={i} title={playlist.name}>
                    <Playlist key={i} playlist_id={playlist.id} username={this.props.username} name={playlist.name} totalTracks={playlist.tracks.total} tracks={playlist.tracks.href} externalUrl={playlist.external_urls.spotify}/>
                </Tab>
            )
        );
        this.setState({list: lists});
    }
    
    render() {
        return (
            <div className="Library">
                <div>
                    <Tabs
                        activeKey={this.state.key}
                        onSelect={this.handleTabs}
                        id="tabs"
                    >
                        {this.state.list}
                    </Tabs>
                </div>
            </div>
        );
    }
}

export default Library;

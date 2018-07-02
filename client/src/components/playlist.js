import React, { Component } from 'react';
import history from '../history';
import {Grid, Row, Col, Button, Panel, Image} from 'react-bootstrap';

import {requestOptions} from '../helpers/requestOptions';

class Playlist extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            playlists: []
        };
    }

    componentWillMount() {
        this.setState({isLoading: true});
        this.getUserPlaylists();
    }

    componentDidMount() {
        if (Object.keys(this.state.playlists).length === 0 && this.state.playlists.constructor === Object) {
            this.setState({isLoading: true});
        } else {
            this.setState({isLoading: false});
        }
    }

    async getUserPlaylists() {
        const data = { 
            access_token: localStorage.getItem('access_token'),
            id: this.props.username
        };

        let response = await fetch('/api/spotify/get-playlists', requestOptions(data, 'POST'));
        let json = await response.json();

        this.setState({playlists: json});
        this.setState({isLoading: false});
        console.log(this.state.playlists);
    }

    createPlaylistThumbnails() {
        let playlists = this.state.playlists.map((playlist) => {
            return (
                <div>
                    <Row>
                        <Col md={4}>
                            <Image src={playlist.images[0].url} width={"200px"} height={"200px"} thumbnail/>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <Panel.Body>
                                <strong>{playlist.name}</strong>
                            </Panel.Body>
                        </Col>
                    </Row>
                </div>
            )
        })
        return playlists;
    }
    
    
    render() {
        console.log('playlist page')

        let renderThis;
        if (this.state.isLoading) {
            renderThis = <p>Loading playlists, please wait...</p>
        } else {
            renderThis = this.createPlaylistThumbnails();
        }

        return (
            <div className="Playlist">
                <h2>Playlist page</h2>
                {renderThis}
            </div>
        );
    }
}

export default Playlist;

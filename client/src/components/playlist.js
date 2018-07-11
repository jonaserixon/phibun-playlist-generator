import React, { Component } from 'react';
import {Row, Col, Button, Panel, Badge, Glyphicon} from 'react-bootstrap';
import {requestOptions} from '../helpers/requestOptions';

class Playlist extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tracklist: [],
            reference: [],  //helper list when making api calls with proper spotify data
            generatedTracks: []
        };

        this.generateNewTrack = this.generateNewTrack.bind(this);
    }

    componentDidMount() {
        this.getTracklist();
    }

    async getTracklist() {
        const data = { 
            access_token: localStorage.getItem('access_token'),
            url: this.props.tracks
        };

        const response = await fetch('/api/playlist-tracks', requestOptions(data, 'POST'));
        const json = await response.json();
        this.setState({reference: json}, () => {
            this.createTracklist();
        })
    }

    createTracklist() {
        let tracklist = [];
    
        this.state.reference.map((track, i) => 
            tracklist.push(
                <Row className="track">
                    <Col md={3}>
                        <p><strong>{track.title}</strong></p>
                    </Col>
                    <Col md={3}>
                        <p><strong>{track.artist}</strong></p>
                    </Col>
                    <Col md={3}>
                        <p><strong>{track.album_name}</strong></p>
                    </Col>
                    <Col md={1}>
                        <p>{track.duration}</p>
                    </Col>
                    <Col md={1}>
                        <Glyphicon className="replace-button" glyph="glyphicon glyphicon-refresh" onClick={this.generateNewTrack} data-track-uri={track.uri} data-track-position={i} />
                    </Col>
                </Row>
            )
        );
        this.setState({tracklist});
    }

    async generateNewTrack(event) {        
        let indexInTracklist = event.target.dataset.trackPosition;
        
        const generateTracks = await fetch('/api/generate-track', requestOptions({access_token: localStorage.getItem('access_token')}, 'POST'))
        const generatedTracks = await generateTracks.json();

        //Välj ifrån dessa 10 låtar när en användare vill replaca låtar i spellistan. Om det tar slut, gör en till request jao
        // this.setState({generatedTracks});

        let array = this.state.reference.map((track) => track.uri);
        console.log('Replacing ' + array[indexInTracklist] + ' with ' + generatedTracks[indexInTracklist]);
        array.splice(indexInTracklist, 1, generatedTracks.shift());

        const data = {
            access_token: localStorage.getItem('access_token'),
            user_id: this.props.username,
            playlist_id: this.props.playlist_id,
            tracks: array
        };

        const response = await fetch('/api/replace-track', requestOptions(data, 'POST'));
        console.log(response);
        
        this.getTracklist();
    }
    
    render() {
        return (
            <div className="Playlist">
                <Panel>
                    <Panel.Heading>
                        <Panel.Title>
                            <Row>
                                <Col md={3}>
                                    <p><strong>{this.props.name}</strong></p>
                                </Col>
                                <Col md={3}> 
                                    <Badge >{this.props.totalTracks}</Badge>
                                </Col>
                                <Col md={3}>
                                    <a href={this.props.externalUrl}>Open in Spotify</a>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={3}>
                                    <p>Title</p>
                                </Col>
                                <Col md={3}>
                                    <p>Artist</p>
                                </Col>
                                <Col md={3}> 
                                    <p>Album</p>
                                </Col>
                                <Col md={3}>
                                    <Glyphicon glyph="glyphicon glyphicon-time" />
                                </Col>
                            </Row>
                        </Panel.Title>
                    </Panel.Heading>
                    <div className="panel-tracklist">
                        {this.state.tracklist}
                    </div>
                </Panel>
            </div>
        );
    }
}

export default Playlist;

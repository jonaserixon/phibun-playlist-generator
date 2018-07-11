import React, { Component } from 'react';
import {Row, Col, Button, Panel, Badge} from 'react-bootstrap';
import {requestOptions} from '../helpers/requestOptions';

class Playlist extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tracklist: [],
            reference: []
        };

        this.generateNewTrack = this.generateNewTrack.bind(this);
    }

    async componentDidMount() {
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
                <div>
                    <p>Artist: {track.artist}</p>
                    <p>Title: {track.title}</p>
                    <p>Album: {track.album_name}</p>
                    <p>Duration: {track.duration}</p>
                    <Button bsStyle="primary" onClick={this.generateNewTrack} data-track-uri={track.uri} data-track-position={i} >Generate new track</Button>
                    <hr/>
                </div>
            )
        );
        this.setState({tracklist});
    }

    async generateNewTrack(event) {
        console.log(this.state.reference);

        console.log(event.target.dataset.trackUri);
        console.log(event.target.dataset.trackPosition);

        console.log(this.state.tracklist);

        let array = this.state.tracklist.slice();
        array.splice(event.target.dataset.trackPosition, 1, array[9]);
        console.log('Replaced ' + this.state.reference[event.target.dataset.trackPosition].title + ' with ' + this.state.reference[9].title + '!');

        this.setState({tracklist: array}, () => {
            console.log(this.state.tracklist);
        });

        /*
            1. Hämta ner en lista med generade låtar
            2. "replaca" en låt i spellistan med någon utav dessa generade låtar
            3. Gör en POST till replace-endpointen med den uppdatera spellistan
        */

        const data = { 
            access_token: localStorage.getItem('access_token'),
            user_id: this.props.username,
            playlist_id: this.props.playlist_id,
            position: event.target.dataset.trackPosition,
            track_uri: event.target.dataset.trackUri
        };

        // const response = await fetch('/api/replace-track', requestOptions(data, 'POST'));
        // const json = await response.json();
        // console.log(json);
    }
    
    render() {
        return (
            <div className="Playlist">
                <Panel eventKey={this.props.name}>
                    <Row>
                        <Panel.Heading>
                            <Panel.Title toggle>
                            <Col md={3}>
                                <p><strong>{this.props.name}</strong></p>
                            </Col>
                            <Col md={3}> 
                                <Badge >{this.props.totalTracks}</Badge>
                            </Col>
                            <Col md={3}>
                                <a href={this.props.externalUrl}>Open in Spotify</a>
                            </Col>
                            </Panel.Title>
                        </Panel.Heading>
                        <Panel.Body collapsible>
                            {this.state.tracklist}
                        </Panel.Body>
                    </Row>
                </Panel>
            </div>
        );
    }
}

export default Playlist;

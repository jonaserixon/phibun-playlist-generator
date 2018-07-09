import React, { Component } from 'react';
import {Grid, Row, Col, Button, Panel, Badge} from 'react-bootstrap';
import {requestOptions} from '../helpers/requestOptions';

class Playlist extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tracklist: []
        };
    }

    async componentDidMount() {
        const data = { 
            access_token: localStorage.getItem('access_token'),
            url: this.props.tracks
        };

        const response = await fetch('/api/playlist-tracks', requestOptions(data, 'POST'));
        const json = await response.json();
        console.log(json);
        this.createTracklist(json);
    }

    createTracklist(json) {
        let tracklist = [];

        json.map((track) => {
            tracklist.push(
                <div>
                    <p>Artist: {track.artist}</p>
                    <p>Title: {track.title}</p>
                    <p>Album: {track.album_name}</p>
                    <p>Duration: {track.duration}</p>
                    <hr/>
                </div>
            )
        })
        this.setState({tracklist});
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

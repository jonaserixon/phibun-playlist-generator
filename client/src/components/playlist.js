import React, { Component } from 'react';
import {Row, Col, Button, Panel, Glyphicon, Tooltip, OverlayTrigger, ListGroup, ListGroupItem} from 'react-bootstrap';
import {requestOptions} from '../helpers/requestOptions';

import FlashMessage from './flashMessage';

class Playlist extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tracklist: [],
            reference: [],  //helper list when making api calls with proper spotify data
            totalTime: '',
            showFlashMessage: false,
            flashType: '',
            flashMessage: '',
            generateMessage: ''
        };

        this.generateNewTrack = this.generateNewTrack.bind(this);
        this.handleDismiss = this.handleDismiss.bind(this);
        this.handleShow = this.handleShow.bind(this);
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
            return;
        })
    }

    createTracklist() {
        let tracklist = [];

        this.state.reference.map((track, i) => 
            tracklist.push(
                <ListGroupItem>
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
                    <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip">Replace "<strong>{track.title}</strong>" by generating a new track!</Tooltip>}>
                        <Button bsStyle="primary" bsSize="small" data-track-uri={track.uri} data-track-position={i} onClick={this.generateNewTrack}>
                            <Glyphicon className="replace-button" glyph="glyphicon glyphicon-refresh" />
                        </Button>
                    </OverlayTrigger>
                    </Col>
                </Row>
                </ListGroupItem>
            )
        );
        
        this.setState({tracklist});
        this.getTotalPlayTime();
    }

    handleDismiss() {
        this.setState({showFlashMessage: false});
    }

    handleShow() {
        this.setState({showFlashMessage: true});
    }

    async generateNewTrack(event) { 
        let indexInTracklist = event.target.dataset.trackPosition;
        let trackToBeReplaced = this.state.reference[indexInTracklist].title

        this.setState({generateMessage: 'Replacing ' + trackToBeReplaced + ' and generating a new track...'});       

        const generateTracks = await fetch('/api/generate-track', requestOptions({access_token: localStorage.getItem('access_token')}, 'POST'));
        const generatedTracks = await generateTracks.json();

        let array = this.state.reference.map((track) => track.uri);
        array.splice(indexInTracklist, 1, generatedTracks.shift());

        const data = {
            access_token: localStorage.getItem('access_token'),
            user_id: this.props.username,
            playlist_id: this.props.playlist_id,
            tracks: array
        };

        let response = await fetch('/api/replace-track', requestOptions(data, 'POST'));
        await this.getTracklist();

        if (response.status === 401 || generateTracks.status === 401) {
            this.setState({showFlashMessage: true});
            this.setState({flashType: 'danger'});
            this.setState({flashMessage: 'You encountered an error. Please try again!'});
        } else {
            this.setState({showFlashMessage: true});
            this.setState({flashType: 'success'});
            this.setState({flashMessage: trackToBeReplaced + ' was successfully replaced with ' + this.state.reference[indexInTracklist].title + '!'});
        }
        this.setState({generateMessage: ''}); 
    }

    getTotalPlayTime() {
        let sumMinutes = 0;
        let sumSeconds = 0;

        this.state.reference.map((track, i) => {
            sumMinutes += parseInt(track.duration.substring(0, 1));
        })

        this.state.reference.map((track, i) => {
            let seconds = track.duration.substring(2, track.duration.length);
            if (seconds.charAt(0) === '0') {
                sumSeconds += parseInt(seconds.substring(1, seconds.length));
            }
            sumSeconds += parseInt(seconds);
        })

        let totalPlaytime = (sumMinutes + Math.floor(sumSeconds / 60)) + ' min ' + (sumSeconds - Math.floor(sumSeconds / 60) * 60) + ' sec';
        this.setState({totalPlaytime});
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
                                    <a href={this.props.externalUrl}>
                                        <Glyphicon glyph="glyphicon glyphicon-new-window" />
                                        Open in Spotify
                                    </a>
                                </Col>
                                <Col md={3}>
                                    <div className="generate-message">
                                        <p>
                                            {this.props.totalTracks + ' songs, ' + this.state.totalPlaytime}
                                        </p>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    {this.state.showFlashMessage ? (
                                        <FlashMessage type={this.state.flashType} message={this.state.flashMessage} handleDismiss={this.handleDismiss}/>
                                    ) : (
                                        <div className="generate-message">
                                            <p>
                                                {this.state.generateMessage}
                                            </p>
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </Panel.Title>
                    </Panel.Heading>
                </Panel>
                <ListGroup>
                    {this.state.tracklist}
                </ListGroup>
                <Row>
                    
                </Row>
            </div>
        );
    }
}

export default Playlist;

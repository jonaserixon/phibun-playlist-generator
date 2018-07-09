import React, { Component } from 'react';
import history from '../history';
import {Grid, Row, Col, Button, Image, Form, FormGroup, FormControl, ControlLabel, Breadcrumb, Panel, PanelGroup} from 'react-bootstrap';

import {requestOptions} from '../helpers/requestOptions';

class Generator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            creatingPlaylist: false,
            playlistCompleted: false,
            flashMessage: '',
            playlist: [],
            tracklist: [],
        };

        this.handleOnClick = this.handleOnClick.bind(this);
    }

    async handleOnClick(event) {
        event.preventDefault();
        this.setState({creatingPlaylist: true});
        this.setState({playlistCompleted: false});
        this.setState({flashMessage: ''});

        let playlist_name = event.target.elements.playlistName.value;

        if (playlist_name === '') playlist_name = 'PhiCloud';
        
        const data = { 
            access_token: localStorage.getItem('access_token'),
            user_id: this.props.username,
            playlist_name
        };

        const response = await fetch('/api/generate-playlist', requestOptions(data, 'POST'));
        const json = await response.json();

        if (response.status == 401) {
            this.setState({flashMessage: 'Error, please try again'});
        } else if (response.status === 502) {
            this.handleOnClick();
        } else {
            this.setState({creatingPlaylist: false});
            this.setState({playlistCompleted: true});
        }
        
        console.log(json);
    }

    generatePlaylist(buttonText) {
        return (
            <div>
                <h3>Automatically Generate Playlist</h3>
                <Form horizontal onSubmit={this.handleOnClick}>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>
                            Name your playlist
                        </Col>
                        <Col sm={2}>
                            <FormControl name="playlistName" type="text" placeholder="Name" />
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Col smOffset={2} sm={10}>
                            <Button bsStyle={"primary"} type="submit">{buttonText}</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        )
    }
    
    render() {
        let buttonText = 'Create Playlist!';
        let toRender = '';
        let playlist;
        let tracklist;
        
        if (this.state.creatingPlaylist) {
            buttonText = 'Creating playlist...';
        }

        if (this.state.playlistCompleted) {
            buttonText = 'Create Playlist!';
            toRender = <p>Playlist created</p>
        }

        if (this.state.flashMessage.length > 1) {
            toRender = <p>{this.state.flashMessage}</p>
        }

        if (this.state.playlist.length > 0) {
            playlist = <Button bsStyle="primary" name="replace" >View your playlist (a link to the playlist in the library view)</Button>
        }


        return (
            <div className="Generator">
                <Grid>              
                    <h3>Automatically Generate Playlist</h3>
                    <Form horizontal onSubmit={this.handleOnClick}>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Name your playlist
                            </Col>
                            <Col sm={2}>
                                <FormControl name="playlistName" type="text" placeholder="Name"/>
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col smOffset={2} sm={10}>
                                <Button bsStyle={"primary"} type="submit">{buttonText}</Button>
                            </Col>
                        </FormGroup>
                    </Form>
                    {toRender}
                    <Row>
                        <Col md={2}>
                            {playlist}
                        </Col>
                        <Col md={4}>
                            {tracklist}
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default Generator;

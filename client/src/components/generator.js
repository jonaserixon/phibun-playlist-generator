import React, { Component } from 'react';
import {Grid, Row, Col, Button, Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';

import {requestOptions} from '../helpers/requestOptions';
import FlashMessage from './flashMessage';

class Generator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            creatingPlaylist: false,
            playlistCompleted: false,
            showFlashMessage: false,
            flashType: '',
            flashMessage: '',
        };

        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleDismiss = this.handleDismiss.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }

    handleDismiss() {
        this.setState({showFlashMessage: false});
    }

    handleShow() {
        this.setState({showFlashMessage: true});
    }

    async handleOnClick(event) {
        event.preventDefault();
        this.setState({creatingPlaylist: true});
        this.setState({playlistCompleted: false});

        let playlist_name = event.target.elements.playlistName.value;

        if (playlist_name === '') playlist_name = 'PhiCloud';
        
        const data = { 
            access_token: localStorage.getItem('access_token'),
            user_id: this.props.username,
            playlist_name
        };

        const response = await fetch('/api/generate-playlist', requestOptions(data, 'POST'));
        const json = await response.json();

        if (response.status === 401) {
            this.setState({showFlashMessage: true});
            this.setState({flashType: 'danger'});
            this.setState({flashMessage: 'You encountered an error. Please try again!'});
        } else if (response.status === 502) {
            this.handleOnClick();
        } else {
            this.setState({creatingPlaylist: false});
            this.setState({playlistCompleted: true});
            this.setState({showFlashMessage: true});
            this.setState({flashType: 'success'});
            this.setState({flashMessage: 'Your playlist was successfully created!'});
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
        
        if (this.state.creatingPlaylist) {
            buttonText = 'Creating playlist...';
        }

        if (this.state.playlistCompleted) {
            buttonText = 'Create Playlist!';
            toRender = <FlashMessage type={this.state.flashType} message={this.state.flashMessage} handleDismiss={this.handleDismiss}/>
        } else {
            toRender = '';
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
                </Grid>
            </div>
        );
    }
}

export default Generator;

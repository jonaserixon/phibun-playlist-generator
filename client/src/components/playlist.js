import React, { Component } from 'react';
import history from '../history';
import {Grid, Row, Col, Button, Panel, Image, Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';

import {requestOptions} from '../helpers/requestOptions';

class Playlist extends Component {
    constructor(props) {
        super(props);

        this.state = {
            creatingPlaylist: false,
            playlistCompleted: false,
            flashMessage: '',
        };

        this.handleOnClick = this.handleOnClick.bind(this);
    }

    async handleOnClick(event) {
        this.setState({creatingPlaylist: true});
        this.setState({playlistCompleted: false});
        this.setState({flashMessage: ''});
        event.preventDefault();
        // const genre = event.target.elements.genre.value;
        
        const data = { 
            access_token: localStorage.getItem('access_token'),
            user_id: this.props.username
        };

        const response = await fetch('/api/reddit/phicloud-playlist', requestOptions(data, 'POST'));
        const json = await response.json();

        if (response.status == 401) {
            this.setState({flashMessage: 'Error, please try again'});
        } else {
            this.setState({creatingPlaylist: false});
            this.setState({playlistCompleted: true});
        }
        
        console.log(json);
    }
    
    render() {
        let toRender = 'Create Playlist!';

        if (this.state.creatingPlaylist) {
            toRender = <p>Creating playlist...</p>
        }

        if (this.state.playlistCompleted) {
            toRender = <p>Playlist created</p>
        }

        if (this.state.flashMessage.length > 1) {
            toRender = <p>{this.state.flashMessage}</p>
        }

        return (
            <div className="Playlist">
                <h2>Playlist page</h2>
                <Form horizontal onSubmit={this.handleOnClick}>
                    <FormGroup>
                        <Col componentClass={ControlLabel} sm={2}>
                            Genre
                        </Col>
                        <Col sm={2}>
                            <FormControl name="genre" type="text" placeholder="Genre" />
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Col smOffset={2} sm={10}>
                            <Button bsStyle={"primary"} type="submit">{toRender}</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}

export default Playlist;

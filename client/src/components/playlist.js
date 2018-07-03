import React, { Component } from 'react';
import history from '../history';
import {Grid, Row, Col, Button, Panel, Image, Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';

import {requestOptions} from '../helpers/requestOptions';

class Playlist extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            playlists: []
        };

        this.handleOnClick = this.handleOnClick.bind(this);

        this.test = this.test.bind(this);
    }

    async test(event) {
        event.preventDefault();
        // const genre = event.target.elements.genre.value;
        
        const data = { 
            access_token: localStorage.getItem('access_token'),
            // user_id: this.props.username
        };

        const response = await fetch('/api/spotify/get-playlists', requestOptions(data, 'POST'));
        const json = await response.json();
        console.log(json);
    }

    async handleOnClick(event) {
        event.preventDefault();
        // const genre = event.target.elements.genre.value;
        
        const data = { 
            access_token: localStorage.getItem('access_token'),
            user_id: this.props.username
        };

        const response = await fetch('/api/reddit/phicloud-playlist', requestOptions(data, 'POST'));
        const json = await response.json();
        console.log(json);
    }

    componentWillMount() {
        this.setState({isLoading: true});
    }

    componentDidMount() {
        if (Object.keys(this.state.playlists).length === 0 && this.state.playlists.constructor === Object) {
            this.setState({isLoading: true});
        } else {
            this.setState({isLoading: false});
        }
    }
    
    render() {
        return (
            <div className="Playlist">
                <h2>Playlist page</h2>
                <Button bsStyle={"primary"} onClick={this.test}>Get Playlists</Button>
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
                            <Button bsStyle={"primary"} type="submit">Create Playlist!</Button>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}

export default Playlist;

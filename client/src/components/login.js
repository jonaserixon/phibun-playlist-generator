import React, { Component } from 'react';
import history from '../history';
import {Grid, Row, Col, Button, Panel} from 'react-bootstrap';

import {requestOptions} from '../helpers/requestOptions';

const client_id = 'afbeb47d1f9745c6a724c4276d96ecbc';
const scopes = 'user-read-private user-read-email playlist-read-private playlist-modify-private playlist-modify-public';
const redirect_uri = 'http://localhost:3000/callback';

const auth_string = 'https://accounts.spotify.com/authorize?response_type=code&client_id=' + client_id + '&scope=' + scopes + '&redirect_uri=' + redirect_uri;

class Login extends Component {
    constructor(props) {
        super(props);
    }

    async componentWillMount() {
        if (history.location.pathname === '/callback') {
            const params = (new URL(document.location)).searchParams;
            const callbackCode = { code: params.get('code') };
            const response = await fetch('/api/auth', requestOptions(callbackCode, 'POST'));
            const json = await response.json();
            localStorage.setItem('access_token', json.access_token);
            localStorage.setItem('refresh_token', json.refresh_token);
        }

        if (localStorage.getItem('access_token')) {
            history.push('/'); 
            this.props.callback(true);
        } else {
            this.props.callback(false);
        }
    }
    
    render() {
        return (
            <div className="Login">
                <Grid>
                    <Panel style={{backgroundColor: "lightgrey"}}>
                        <Row className="text-center">
                            <Col md={12}>
                                <h2>Phibun - Spotify Playlist Generator!</h2>
                            </Col>
                        </Row>
                        <Row className="text-center">
                            <Col md={6} mdOffset={3}>
                                <a href={auth_string}>
                                    <Button bsStyle="success">
                                        Login with your Spotify Account!
                                    </Button>
                                </a>
                            </Col>
                        </Row>
                        <Row>
                            <br/>
                        </Row>
                    </Panel>
                    <Row className="text-center">
                        <Col md={6} mdOffset={3}>
                            <p style={{color: "lightgrey"}}>Made by Jonas Erixon 2018</p>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default Login;

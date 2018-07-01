import React, { Component } from 'react';
import history from '../history';
import {Grid, Row, Col, Button} from 'react-bootstrap';

import {requestOptions} from '../helpers/requestOptions';

const client_id = 'afbeb47d1f9745c6a724c4276d96ecbc';
const scopes = 'user-read-private user-read-email';
const redirect_uri = 'http://localhost:3000/callback';

const auth_string = 'https://accounts.spotify.com/authorize?response_type=code&client_id=' + client_id + '&scope=' + scopes + '&redirect_uri=' + redirect_uri;

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };

    }

    async componentWillMount() {
        if (history.location.pathname === '/callback') {
            const params = (new URL(document.location)).searchParams;
            const callbackCode = { code: params.get('code') };
            let response = await fetch('/api/spotify/login', requestOptions(JSON.stringify(callbackCode), 'POST'));
            let json = await response.json();
            localStorage.setItem('access_token', json.access_token);
            localStorage.setItem('refresh_token', json.refresh_token);
            console.log('En ny liten token har sparats i localStorage =)');
        }

        if (localStorage.getItem('access_token')) {
            history.push('/'); 
            this.props.callback(true);  //set state in parent component
        } else {
            this.props.callback(false); //set state in parent component
        }
    }
    
    render() {
        console.log('login page')
        return (
            <div className="Login">
                <div>
                    <a href={auth_string}>
                        <Button bsStyle="success">
                            Login with your Spotify Account!
                        </Button>
                    </a>
                </div>
            </div>
        );
    }
}

export default Login;

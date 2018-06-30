import React, { Component } from 'react';
import './App.css';
import history from './history';
import {Grid, Row, Col, Button} from 'react-bootstrap';
// import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { Router } from 'react-router-dom';

import {requestOptions} from './helpers/requestOptions';


const client_id = 'afbeb47d1f9745c6a724c4276d96ecbc';
const scopes = 'user-read-private user-read-email';
const redirect_uri = 'http://localhost:3000/callback';

const auth_string = 'https://accounts.spotify.com/authorize?response_type=code&client_id=' + client_id + '&scope=' + scopes + '&redirect_uri=' + redirect_uri;

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: false,
            userInfo: {}
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        this.setState({isLoggedIn: false});
    }

    async getUserInfo() {
        const token = { access_token: localStorage.getItem('access_token')};
        let response = await fetch('/api/spotify/user-info', requestOptions(JSON.stringify(token), 'POST'));
        let json = await response.json();

        this.setState({userInfo: json})
        return json;
    }

    async componentWillMount() {
        if (history.location.pathname === '/callback') {
            const params = (new URL(document.location)).searchParams;
            const callbackCode = { code: params.get('code') };

            let response = await fetch('/api/spotify/login', requestOptions(JSON.stringify(callbackCode), 'POST'));
            let json = await response.json();
            localStorage.setItem('access_token', json.access_token);
            localStorage.setItem('refresh_token', json.refresh_token);
        }

        if (localStorage.getItem('access_token')) {
            this.setState({isLoggedIn: true});
            history.push('/'); 
            this.getUserInfo();
        } else {
            this.setState({isLoggedIn: false});
        }
    }
    
    render() {
        let isLoggedIn;
        console.log('Logged in: ' + this.state.isLoggedIn);

        if (this.state.isLoggedIn) {
            console.log(this.state.userInfo);
            isLoggedIn = 
            <div>
                <form onSubmit={this.handleSubmit}>
                    <Button bsStyle="success" type={"submit"}>
                        Logout
                    </Button>
                </form>
                <p>
                    Welcome, {this.state.userInfo.display_name}
                </p>
            </div>
        } else {
            isLoggedIn = 
            <div>
                <a href={auth_string}>
                    <Button bsStyle="success" type={"submit"}>
                        Login with your Spotify Account!
                    </Button>
                </a>;
            </div>
        }

        return (
            <Router history={history}>
                <div className="App">
                    <p>PhiCloud Client!</p>
                    {isLoggedIn}
                </div>
            </Router>
        );
    }
}

export default App;

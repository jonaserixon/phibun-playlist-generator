import React, { Component } from 'react';
import './App.css';
import history from './history';
import {Grid, Row, Col, Button} from 'react-bootstrap';
// import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { Router } from 'react-router-dom';


const client_id = 'afbeb47d1f9745c6a724c4276d96ecbc';
const scopes = 'user-read-private user-read-email';
const redirect_uri = 'http://localhost:3000/callback';

const auth_string = 'https://accounts.spotify.com/authorize?response_type=code&client_id=' + client_id + '&scope=' + scopes + '&redirect_uri=' + redirect_uri;

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        fetch('/api/spotify/login', {
            method: 'GET'
        })
    }

    async componentWillMount() {
        if (history.location.pathname === '/callback') {
            const params = (new URL(document.location)).searchParams;
            const callbackCode = { code: params.get('code') };

            let options = {
                body: JSON.stringify(callbackCode),
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }

            let response = await fetch('/api/spotify/login', options);
            let json = await response.json();
            localStorage.setItem('access_token', json.access_token);
        }
    }
    
    render() {
        return (
            <Router history={history}>
                <div className="App">
                    <p>PhiCloud Client!</p>

                    <a href={auth_string}>
                        <Button bsStyle="success" type={"submit"}>
                            Login with your Spotify Account!
                        </Button>
                    </a>
                </div>
            </Router>
        );
    }
}

export default App;

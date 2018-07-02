import React, { Component } from 'react';
import './App.css';
import history from './history';
import {Grid, Row, Col, Button} from 'react-bootstrap';
// import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { Router } from 'react-router-dom';

import {requestOptions} from './helpers/requestOptions';
import Login from './components/login';
import Dashboard from './components/dashboard';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: false,
        };

        this.callbackLogin = this.callbackLogin.bind(this);
    }

    callbackLogin(isUserLoggedIn) {
        this.setState({isLoggedIn: isUserLoggedIn});
    }

    async componentDidUpdate() {
        if (localStorage.getItem('access_token')) {
            const token = { access_token: localStorage.getItem('access_token')};
            
            let response = await fetch('/api/spotify/user-info', requestOptions(token, 'POST'));
            
            if (response.status === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                this.setState({isLoggedIn: false});
            }
        }
    }
    
    render() {
        console.log('app page')

        return (
            <Router history={history}>
                <div className="App">
                    <p>PhiCloud Client!</p>
                    {this.state.isLoggedIn ? (
                        <Dashboard callback={this.callbackLogin}/>
                    ) : (
                        <Login callback={this.callbackLogin}/>
                    )}
                </div>
            </Router>
        );
    }
}

export default App;

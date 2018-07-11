import React, { Component } from 'react';
import './App.css';
import history from './history';
import { Router } from 'react-router-dom';

import {requestOptions} from './helpers/requestOptions';
import Login from './components/login';
import Navigation from './components/navigation';

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
            const response = await fetch('/api/user', requestOptions(token, 'POST'));
            
            if (response.status === 401) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                this.setState({isLoggedIn: false});
            }
        }
    }

    render() {
        return (
            <Router history={history}>
                <div className="App">
                    {this.state.isLoggedIn ? (
                        <Navigation callback={this.callbackLogin}/>
                    ) : (
                        <Login callback={this.callbackLogin}/>
                    )}
                </div>
            </Router>
        );
    }
}

export default App;

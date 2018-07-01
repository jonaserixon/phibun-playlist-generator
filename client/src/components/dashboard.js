import React, { Component } from 'react';
import history from '../history';
import {Grid, Row, Col, Button} from 'react-bootstrap';

import {requestOptions} from '../helpers/requestOptions';
import Profile from './profile';

class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };

        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick(event) {
        event.preventDefault();
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        this.props.callback(false);
    }
    
    render() {
        console.log('Dashboard page')
        return (
            <div className="Dashboard">
                <p>The main page of this application. "Start page" </p>
                <Button bsStyle="success" onClick={this.handleOnClick}>
                    Logout
                </Button>

                <Profile />
            </div>
        );
    }
}

export default Dashboard;

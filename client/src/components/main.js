import React, { Component } from 'react';
import history from '../history';
import {Grid, Row, Col, Button} from 'react-bootstrap';

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }
    
    render() {
        return (
            <div className="Main">
                <p>The main page of this application. "Start page" </p>
            </div>
        );
    }
}

export default Main;

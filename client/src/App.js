import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {Grid, Row, Col, Button} from 'react-bootstrap';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        fetch('/api/spotify/login', {
            method: 'GET'
        })
    }
    
    render() {
        return (
            <div className="App">
                <p>PhiCloud Client!</p>

                <form onSubmit={this.handleSubmit}>
                    <Button bsStyle="success" type={"submit"}>
                        Login with your Spotify Account!
                    </Button>
                </form>
            </div>
        );
    }
}

export default App;

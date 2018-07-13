import React, { Component } from 'react';
import {Grid, Row, Col, ListGroup, ListGroupItem, Glyphicon, Panel, Nav, NavItem} from 'react-bootstrap';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import Profile from './profile';

class Navigation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: ''
        };

        this.handleOnClick = this.handleOnClick.bind(this);
        this.setUsername = this.setUsername.bind(this);
    }

    handleOnClick(event) {
        event.preventDefault();
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        this.props.callback(false);
    }

    setUsername(username) {
        this.setState({username: username});
        this.props.setUsername(username);
    }
    
    render() {
        return (
            <div className="Navigation">
                {/* <div className="header">
                    <Row className="text-center">
                        <Col md={12}>
                            <h5>Phibun Playlist Generator</h5>
                        </Col>
                    </Row>
                </div> */}

                <Nav bsStyle="tabs">
                <LinkContainer to="/home">
                    <NavItem>
                        <Glyphicon glyph={"glyphicon glyphicon-home"} className="dashboard-icon"/>
                        Home
                    </NavItem>
                </LinkContainer>
                <LinkContainer to="/generate">
                    <NavItem>
                        <Glyphicon glyph={"glyphicon glyphicon-tasks"} className="dashboard-icon"/>
                        Generate Playlist
                    </NavItem>
                </LinkContainer>
                <LinkContainer to="/library">
                    <NavItem>
                        <Glyphicon glyph={"glyphicon glyphicon-th-list"} className="dashboard-icon"/>
                        Your Playlists
                    </NavItem>
                </LinkContainer>
                    <NavItem onClick={this.handleOnClick}>
                        <Glyphicon glyph={"glyphicon glyphicon-log-out"} className="dashboard-icon"/>
                        Logout
                    </NavItem>
                    <NavItem disabled>

                    <Profile usernameCallback={this.setUsername} callback={this.props.callback}/>
                    </NavItem>
                </Nav>
            </div>
        );
    }
}

export default Navigation;

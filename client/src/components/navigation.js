import React, { Component } from 'react';
import {Grid, Row, Col, ListGroup, ListGroupItem, Glyphicon} from 'react-bootstrap';

import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';

import Profile from './profile';
import Generator from './generator';
import Library from './library';

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
    }
    
    render() {
        return (
            <Router>
                <div className="Navigation">
                    <Grid fluid style={{ paddingLeft: 20, paddingRight: 20 }}>
                        <Row>
                            <Col md={2}>
                                <div className="dashboard-container">
                                    <Row className="text-center">
                                        <Col md={12}>
                                            <h5>PhiCloud</h5>
                                        </Col>
                                    </Row>

                                    <Profile usernameCallback={this.setUsername} callback={this.props.callback}/>

                                    <Row>
                                        <Col md={12}>
                                            <ListGroup>
                                                <Link to="/generate">
                                                    <ListGroupItem>
                                                        <Glyphicon glyph={"glyphicon glyphicon-tasks"} className="dashboard-icon"/>
                                                        Generate Playlist
                                                    </ListGroupItem>
                                                </Link>

                                                <Link to="/library">
                                                    <ListGroupItem>
                                                        <Glyphicon glyph={"glyphicon glyphicon-th-list"} className="dashboard-icon"/>
                                                        Your library
                                                    </ListGroupItem>
                                                </Link>

                                                <Link to="/"  onClick={this.handleOnClick}>
                                                    <ListGroupItem>
                                                        <Glyphicon glyph={"glyphicon glyphicon-log-out"} className="dashboard-icon"/>
                                                        Logout
                                                    </ListGroupItem>
                                                </Link>
                                            </ListGroup>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                            <Col md={9}>
                                <div className="content-container">
                                    <Switch>
                                        <Route exact path='/generate' component={() => <Generator username={this.state.username}/>} />
                                        <Route exact path='/library' component={() => <Library username={this.state.username}/>} />
                                    </Switch>
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </Router>
        );
    }
}

export default Navigation;

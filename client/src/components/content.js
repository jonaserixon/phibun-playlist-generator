import React, { Component } from 'react';
import {Panel, Grid, Row, Col} from 'react-bootstrap';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import Navigation from './navigation';
import Profile from './profile';
import Generator from './generator';
import Library from './library';
import Home from './home';
class Content extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: ''
        }
        this.setUsername = this.setUsername.bind(this);
    }

    setUsername(username) {
        this.setState({username})
    }

    render() {
        return (
            <Router>
            <div className="Content">
                <Navigation setUsername={this.setUsername} callback={this.props.callback} />
                <Panel >
                    <Switch>
                        <Route exact path='/generate' component={() => <Generator username={this.state.username}/>} />
                        <Route exact path='/library' component={() => <Library username={this.state.username}/>} />
                        <Route path='/' component={() => <Home />} />
                    </Switch>
                </Panel>
            </div>
            </Router>
        );
    }
}

export default Content;

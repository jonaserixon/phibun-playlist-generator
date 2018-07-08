import React, { Component } from 'react';
import history from '../history';
import {Grid, Row, Col, Button, Panel, Image} from 'react-bootstrap';

import {requestOptions} from '../helpers/requestOptions';

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userInfo: {},
            isLoading: true,
        };

    }

    componentWillMount() {
        this.getUserInfo();
    }

    componentDidMount() {
        if (Object.keys(this.state.userInfo).length === 0 && this.state.userInfo.constructor === Object) {
            this.setState({isLoading: true});
        } else {
            this.setState({isLoading: false});
        }
    }

    async getUserInfo() {
        const token = { access_token: localStorage.getItem('access_token')};

        const response = await fetch('/api/user', requestOptions(token, 'POST'));
        const json = await response.json();

        this.setState({userInfo: json});
        this.setState({isLoading: false});
        this.props.usernameCallback(this.state.userInfo.id);
        console.log(this.state.userInfo);
    }

    contentToRender() {
        return (
            <Row>
                <Col md={12}>
                    <Panel>
                        <Row>
                            <Col md={12}>
                                <a href={this.state.userInfo.external_urls.spotify}>
                                    <Image src={this.state.userInfo.images[0].url} width={"100%"} thumbnail/>
                                </a>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={12}>
                                <Panel.Body>
                                    Logged in as <strong>{this.state.userInfo.id}</strong>
                                </Panel.Body>
                            </Col>
                        </Row>
                    </Panel>
                </Col>
            </Row>
        );
    }
    
    render() {
        let renderThis;
        if (this.state.isLoading) {
            renderThis = <p>Loading content, please wait...</p>
        } else {
            renderThis = this.contentToRender();
        }

        return (
            <div className="Profile">
                {renderThis}
            </div>
        );
    }
}

export default Profile;

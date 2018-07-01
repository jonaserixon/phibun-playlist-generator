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

        let response = await fetch('/api/spotify/user-info', requestOptions(JSON.stringify(token), 'POST'));
        let json = await response.json();

        this.setState({userInfo: json});
        this.setState({isLoading: false});

        console.log(this.state.userInfo);
    }

    contentToRender() {
        return (
            <Grid>
                <Row>
                    <Col md={3}>
                        <Panel>
                            <Panel.Heading>
                                <Panel.Title componentClass="h3">{this.state.userInfo.display_name}</Panel.Title>
                            </Panel.Heading>
                            <Image src={this.state.userInfo.images[0].url} width={"200px"} height={"200px"} circle />
                            <Panel.Body>
                                Information about the user
                            </Panel.Body>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
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

import React, { Component } from 'react';
import {Row, Col, Panel, Image} from 'react-bootstrap';

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
        this.setState({isLoading: true});
        this.getUserInfo();
    }

    componentDidUpdate() {
        if (this.state.userInfo.external_urls === undefined) {
            this.props.callback(false);
        } 
    }

    async getUserInfo() {
        const token = { access_token: localStorage.getItem('access_token')};
        const response = await fetch('/api/user', requestOptions(token, 'POST'));
        const json = await response.json();
        this.setState({userInfo: json});
        this.setState({isLoading: false});
        this.props.usernameCallback(this.state.userInfo.id);
    }
    
    render() {
        let renderThis;
        if (this.state.isLoading) {
            renderThis = <p>Loading photo, please wait...</p>
        } else {
            renderThis = (
                <Row>
                <Col md={6}>
                    <p style={{color: 'ghostwhite', fontSize: '12px'}}>Logged in as {this.state.userInfo.id}</p>
                </Col>
                <Col md={1}>
                    <Image src={this.state.userInfo.images[0].url} width={"30px"} circle/>
                </Col>
                </Row>
            )
        }

        return (
            <div className="Profile">
                {renderThis}
            </div>
        );
    }
}

export default Profile;

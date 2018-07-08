import React, { Component } from 'react';
import {Grid, Row, Col, Button} from 'react-bootstrap';
import {requestOptions} from '../helpers/requestOptions';

class Library extends Component {
    constructor(props) {
        super(props);

        this.state = {
            playlists: []
        };
    }

    async componentWillMount() {
        const data = { 
            access_token: localStorage.getItem('access_token'),
            user_id: this.props.username,
        };

        const response = await fetch('/api/library-playlists', requestOptions(data, 'POST'));
        const json = await response.json();
        console.log(json);
        // this.setState({playlists: json});
        // console.log(this.state.playlists);
    }
    
    render() {
        return (
            <div className="Library">
                <div>
                    Library
                    {/* {this.state.playlists} */}
                </div>
            </div>
        );
    }
}

export default Library;

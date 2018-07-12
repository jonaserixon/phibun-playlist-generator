import React, { Component } from 'react';
import {Grid, Row, Col, Button, Panel, Badge, Glyphicon, PageHeader} from 'react-bootstrap';
import {requestOptions} from '../helpers/requestOptions';

class Playlist extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className="Home">
            <Grid>
                <Row>
                    <Col md={12}>
                        <PageHeader>
                            Welcome to the Phibun Playlist Generator!
                        </PageHeader>
                    </Col>
                </Row>
                <Row>
                    <Col md={6} >
                        <h3>Generate Playlists</h3>
                        <p>
                            You can generate your own playlists by clicking on the <strong>Generate Playlist</strong> button in the sidebar.
                        </p>
                        <h3>View created playlists and replace tracks</h3>
                        <p>
                            After creating at least 1 playlist you will be able to view your generated playlists in the <strong>Your Library</strong> page. 
                            You can also replace individual tracks and with newly generated tracks.
                        </p>
                        
                    </Col>
                </Row>
            </Grid>
            </div>
        );
    }
}

export default Playlist;

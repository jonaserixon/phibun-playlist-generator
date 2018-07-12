import React, { Component } from 'react';
import {Grid, Row, Col, Button, Alert} from 'react-bootstrap';

class FlashMessage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="FlashMessage">
                    <Col md={12}>
                        <Alert bsStyle={this.props.type} onDismiss={this.props.handleDismiss}>
                            <h4>{this.props.message}</h4>
                            <p>
                                <Button onClick={this.props.handleDismiss}>Hide</Button>
                            </p>
                        </Alert>
                    </Col>
            </div>
        );
    }
}

export default FlashMessage;

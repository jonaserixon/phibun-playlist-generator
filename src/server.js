const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const app = express();

const start = () => {
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    //API
    app.use('/api/', require('./routes/test'));

    app.listen(process.env['SERVER_PORT'], () => {
        console.log('Express listening on port ' + process.env['SERVER_PORT'])
    });
}

module.exports = {start};

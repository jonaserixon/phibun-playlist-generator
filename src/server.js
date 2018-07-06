const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const app = express();
const cors = require('cors');

const start = () => {
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());

    app.use('/api/spotify', require('./routes/spotify'));
    app.use('/api/reddit', require('./routes/reddit'));

    app.listen(process.env['SERVER_PORT'], () => {
        console.log('Express listening on port ' + process.env['SERVER_PORT'])
    });
}

module.exports = {start};

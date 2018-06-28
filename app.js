const dotenv = require('dotenv');
const database = require('./src/config/database');
const server = require('./src/server');

dotenv.config();
database.initialize();
server.start();

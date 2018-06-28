const server = require('./src/server');
const dotenv = require('dotenv');
const database = require('./src/config/database');

dotenv.config();
database.initialize();
server.start();

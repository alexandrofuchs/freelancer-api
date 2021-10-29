require('dotenv/config');

const Sequelize = require('sequelize');
const database = require('../config/database');

const User = require('./models/User');

const sequelize = new Sequelize(process.env.DB_URL);

User.init(sequelize);

module.exports = sequelize;
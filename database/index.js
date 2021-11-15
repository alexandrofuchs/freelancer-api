require('dotenv/config');

const Sequelize = require('sequelize');
const database = require('../config/database');

const User = require('./models/User');
const Profile = require('./models/Profile');
const ProfileItem = require('./models/ProfileItems');

const sequelize = new Sequelize(process.env.DB_URL);

User.init(sequelize);
ProfileItem.init(sequelize);
Profile.init(sequelize);


User.associate(sequelize.models);
ProfileItem.associate(sequelize.models);
Profile.associate(sequelize.models);


module.exports = sequelize;
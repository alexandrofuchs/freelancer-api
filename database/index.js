require('dotenv/config');

const Sequelize = require('sequelize');

const User = require('./models/User');
const Profile = require('./models/Profile');
const ProfileItem = require('./models/ProfileItem');
const Service = require('./models/Service');
const ServiceOrder = require('./models/ServiceOrder');
const Day = require('./models/Day');
const Schedule = require('./models/Schedule');
const Question = require('./models/Question');
const Review = require('./models/Review');
const ServiceItem = require('./models/ServiceItem');
const Message = require('./models/Message');

const sequelize = new Sequelize(process.env.DB_URL);

User.init(sequelize);
ProfileItem.init(sequelize);
Profile.init(sequelize);

Service.init(sequelize);
ServiceOrder.init(sequelize);
Day.init(sequelize);
Schedule.init(sequelize);
Question.init(sequelize);
Review.init(sequelize);
ServiceItem.init(sequelize);
Message.init(sequelize);

User.associate(sequelize.models);
ProfileItem.associate(sequelize.models);
Profile.associate(sequelize.models);
Service.associate(sequelize.models);
ServiceOrder.associate(sequelize.models);
Day.associate(sequelize.models);
Schedule.associate(sequelize.models);
Question.associate(sequelize.models);
Review.associate(sequelize.models);
ServiceItem.associate(sequelize.models);
Message.associate(sequelize.models);

module.exports = sequelize;
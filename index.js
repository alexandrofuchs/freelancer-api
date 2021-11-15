require('dotenv/config');
const express = require('express');
const app = express();
const cors = require('cors');
const sequelize = require('./database');

app.use(cors({
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Authorization", "Content-Type"]
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }))

require('./api/controllers/UserController')(app);
require('./api/controllers/UserProfileController')(app);
// require('./api/controllers/productController')(app);
// require('./api/controllers/categoryController')(app);
// require('./api/controllers/orderController')(app);

const DBConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to database!', error);
  }
}

DBConnection();

app.listen(1996);
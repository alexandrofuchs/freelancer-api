require('dotenv/config');
const express = require('express');
const path = require("path");
const app = express();
const cors = require('cors');
const sequelize = require('./database');
const ProfileItem = require('./database/models/ProfileItem');
const { text } = require('express');
const Message = require('./database/models/Message');

app.use(cors({
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Authorization", "Content-Type"]
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }))

require('./api/controllers/UserController')(app);
require('./api/controllers/UserProfileController')(app);
require('./api/controllers/ServiceController')(app);
require('./api/controllers/QuestionController')(app);
require('./api/controllers/ServiceOrderController')(app);
require('./api/controllers/ReviewController')(app);

const DBConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to database!', error);
  }
}

DBConnection();

const server = require('http').createServer(app);
const io = require('socket.io')(server);


io.on("connection", async (socket) => {

  console.log(socket.handshake.auth)

  console.log("usuário conectado!");

  const messages = await Message.findAll({attributes:['user','message','serviceOrderId']});

  socket.emit('previusMessages', messages);

  socket.on('sendMessage', data => {

    const saveMessage = async () => {
      await Message.create({
        user: data.user,
        message: data.message,
        serviceOrderId: data.serviceOrderId,
      });
    }

    saveMessage();
    
    io.emit('receivedMessage', data);
  });  

});


server.listen(1996);
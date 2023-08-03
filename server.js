const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const colors = require('colors');
const connect = require('./config/db.js');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

/** app middlewares */
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

/** application port */
const port = process.env.PORT || 6252;

/** routes */
// Handle requests with "/app" URL path
app.get('/api/v1', (req, res) => {
  try {
    res.json('Get Request for /app URL path');
    // Modify this handler to handle requests for /app URL path as needed
  } catch (error) {
    res.json(error);
  }
});


const userRoute = require('./routes/user.route.js');
app.use('/api/v1/auth', userRoute);


connect()
  .then(() => {
    try {
      server.listen(port, () => {
        console.log(`Server connected to ${port}`.green.bold);
      });
    } catch (error) {
      console.log('Cannot connect to the server'.red.bold);
    }
  })
  .catch((error) => {
    console.log('Invalid Database Connection');
  });

/** Socket.io events */
io.on('connection', (socket) => {
  console.log(`New Client connected. Client ID ${socket.id}`);

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

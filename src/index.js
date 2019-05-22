/* eslint-disable import/first */
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import { Server } from 'http';
// import SocketIO from 'socket.io-client';
import Logger from './utils/logger';

dotenv.config();

import { messageHandler } from './modules/rootHandler';
import { verifyRequestSignature } from './modules/facebook';

// LOADING CONFIG AND PARAMETERS
const { PORT = 3000, FB_APP_SECRET } = process.env;
if (!FB_APP_SECRET) throw new Error('[INDEX.JS] Missing FB_APP_SECRET');

const FB_VERIFY_TOKEN = 'anhcoyeuemkhong';
Logger.success(`/webhook will accept the Verify_Token: "${FB_VERIFY_TOKEN}"`);
// END LOADING CONFIG AND PARAMETERS


// SETUP EXPRESS
const app = express();

// apply logger
app.use((request, response, next) => {
  const { method, url } = request;
  response.on('finish', () => {
    Logger.note(`${response.statusCode} ${method} ${url}`);
  });
  next();
});

app.use(bodyParser.json({ verify: verifyRequestSignature }));

// Webhook setup
app.get('/webhook', (req, res) => {
  if (
    req.query['hub.mode'] === 'subscribe'
    && req.query['hub.verify_token'] === FB_VERIFY_TOKEN
  ) {
    res.send(req.query['hub.challenge']);
  } else {
    Logger.err('FAILED TO SETUP WEBHOOK');
    res.sendStatus(400);
  }
});

// Message handler
app.post('/webhook', messageHandler);

// const server = Server(app);
// const io = SocketIO(server);
// END SETUP EXPRESS

// SETUP SOCKETIO
// because we have a situation that our bot cannot handle the user request
// within that situation, we will use socket.io to connect to real agent and let the real agent chat the real user
// but why do we use socket.io?
// because chatting request low lantency
// by using HTTP protocol will harm performance and cause bad UX

// io.on('connection', (socket) => {
//   socket.emit('news', { hello: 'world' });
//   socket.on('ping', () => {
//     console.log('pong');
//   });
// });

// END SETUP SOCKETIO

// SETUP MONGOOSE
const db = mongoose.connection;
const { MONGO_URL, MONGO_USER, MONGO_PASSWORD } = process.env;
db.once('open', () => {
  Logger.info('Established connection to database server');

  app.listen(PORT, () => {
    Logger.success(`Listening on port: ${PORT}`);
  });
});

// prevent server from starting if db is not connected
db.on('error', (err) => {
  Logger.error('Unable to connect to database server');
  Logger.error(`${err.message}`);
  Logger.error('Server has been stopped!');
});

Logger.info('Connecting to database');
mongoose.connect(MONGO_URL, {
  user: MONGO_USER,
  pass: MONGO_PASSWORD,
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
});
// END SETUP MONGOOSE

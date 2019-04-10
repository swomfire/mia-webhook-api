import bodyParser from 'body-parser';
import express from 'express';
import dotenv from 'dotenv';
import { verifyRequestSignature, messageHandler } from './handler';

dotenv.config();

// ==========================================================================
// LOADING CONFIG AND PARAMETERS
// ==========================================================================
const PORT = process.env.PORT || 3000;
const { FB_APP_SECRET } = process.env;
if (!FB_APP_SECRET) throw new Error('[INDEX.JS] Missing FB_APP_SECRET')

const FB_VERIFY_TOKEN = 'anhcoyeuemkhong';
console.log(`/webhook will accept the Verify_Token: "${FB_VERIFY_TOKEN}"`);
// ==========================================================================


// ==========================================================================
// SETUP EXPRESS
// ==========================================================================
const app = express();

// apply logger
app.use((request, response, next) => {
  const { method, url } = request;
  response.on('finish', () => {
    console.log(`${response.statusCode} ${method} ${url}`);
  });
  next();
});

app.use(bodyParser.json({ verify: verifyRequestSignature }));

// Webhook setup
app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === FB_VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    console.log('FAILED TO SETUP WEBHOOK');
    res.sendStatus(400);
  }
});

// Message handler
app.post('/webhook', messageHandler);

app.listen(PORT);
console.log(`Listening on port: ${PORT}`);
// ==========================================================================

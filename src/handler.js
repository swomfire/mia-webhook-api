/* eslint-disable camelcase */
/* eslint-disable no-plusplus */
import crypto from 'crypto';
import { Wit, log } from 'node-wit';
import { reply } from './facebook';
/*
 * Verify that the callback came from Facebook. Using the App Secret from
 * the App Dashboard, we can verify the signature that is sent with each
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
const { WIT_TOKEN } = process.env; // Wit.ai parameters
if (!WIT_TOKEN) throw new Error('[INDEX.JS] Missing WIT_TOKEN');
const { FB_APP_SECRET } = process.env;
if (!FB_APP_SECRET) throw new Error('[HANDLER.JS] Missing FB_APP_SECRET');

export function verifyRequestSignature(req, res, buf) {
  const signature = req.headers['x-hub-signature'];
  console.log(signature);

  if (!signature) {
    // For testing, let's log an error. In production, you should throw an
    // error.
    console.error('Couldn\'t validate the signature.');
  } else {
    const elements = signature.split('=');
    // const method = elements[0];
    const signatureHash = elements[1];

    const expectedHash = crypto.createHmac('sha1', FB_APP_SECRET)
      .update(buf)
      .digest('hex');

    if (signatureHash !== expectedHash) {
      throw new Error('Couldn\'t validate the request signature.');
    }
  }
}

// Setting up our bot
const wit = new Wit({
  accessToken: WIT_TOKEN,
  logger: new log.Logger(log.INFO),
});


const learningEntityHandler = async (senderId, entities) => {
  const { learningName } = entities;
  if (!learningName) {
    await reply(senderId, 'Sorry but your request havent been supported yet!');
    return;
  }
  const promiseArr = [];
  for (let i = 0; i < learningName.length; i++) {
    if (learningName[i].value === 'javascript') {
      promiseArr.push(reply(senderId, 'https://nodejs.com'));
    } else {
      promiseArr.push(reply(senderId, `Oops! We havent support ${learningName[i].value} yet!`));
    }
  }
  await Promise.all(promiseArr);
};

const swearingEntityHandler = async (senderId, entities) => {
  const { swear_word } = entities;
  if (!swear_word) {
    await reply(senderId, 'Say that again!');
    return;
  }
  const promiseArr = [];
  for (let i = 0; i < swear_word.length; i++) {
    if (swear_word[i].value === 'nigga') {
      promiseArr.push(reply(senderId, 'Chill man! Im Asian!'));
    } else {
      promiseArr.push(reply(senderId, 'What a dirty word!'));
    }
  }
  await Promise.all(promiseArr);
};

const entitiesHandler = async (senderId, entities) => {
  // You can customize your response to these entities
  // For now, let's reply with another automatic message
  const { intent } = entities;
  if (!intent) {
    await reply(senderId, 'W0t?');
    return;
  }

  const callTable = {
    learning: learningEntityHandler,
    swearing: swearingEntityHandler,
  };

  const promiseArr = [];
  for (let i = 0; i < intent.length; i++) {
    const currentIntent = intent[i];
    promiseArr.push(callTable[currentIntent.value](senderId, entities));
  }
  await Promise.all(promiseArr);
};

export const messageHandler = async (req, res) => {
  const { object, entry = [] } = req.body;

  if (object !== 'page') {
    res.sendStatus(200);
    return;
  }

  for (let i = 0; i < entry.length; i++) {
    const currentEntry = entry[i];
    const { messaging = [] } = currentEntry;
    for (let j = 0; j < messaging.length; j++) {
      const event = messaging[j];
      if (!event.message || event.message.is_echo) {
        console.log('Received event:', JSON.stringify(event));
        continue;
      } // end if
      // Yay! We got a new message!
      // We retrieve the Facebook user ID of the sender
      const { id: senderId } = event.sender;

      // We retrieve the message content
      const { text, attachments } = event.message;

      if (attachments) {
        // We received an attachment
        // Let's reply with an automatic message
        reply(senderId, 'Sorry I can only process text messages for now.')
          .catch(console.error);
        continue;
      } // end if

      if (text) {
        // We received a text message
        // Let's run /message on the text to extract some entities
        wit.message(text)
          .then(async ({ entities }) => {
            try {
              await reply(senderId, `We've received your message: ${text}.`);
              await entitiesHandler(senderId, entities);
            } catch (error) {
              console.log('error while sending message: ', error.message || error);
            }
          })
          .catch(error => console.error('Oops! Got an error from Wit: ', error.stack || error));
      } // end if
    } // end 2nd loop
  } // end first loop
  res.sendStatus(200);
};

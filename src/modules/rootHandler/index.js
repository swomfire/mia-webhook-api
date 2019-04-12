/* eslint-disable camelcase */
import { Wit, log } from 'node-wit';
import { reply } from '../facebook';
import Logger from '../../libs/logger';

/*
 * Verify that the callback came from Facebook. Using the App Secret from
 * the App Dashboard, we can verify the signature that is sent with each
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
const { WIT_TOKEN } = process.env; // Wit.ai parameters
if (!WIT_TOKEN) throw new Error('[HANDLER.JS] Missing WIT_TOKEN');

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

// handle message response
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

// handle received message
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
        Logger.info('Received event:', JSON.stringify(event));
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
          .catch(Logger.error);
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
              Logger.error('error while sending message: ', error.message || error);
            }
          })
          .catch(error => console.error('Oops! Got an error from Wit: ', error.stack || error));
      } // end if
    } // end 2nd loop
  } // end first loop
  res.sendStatus(200);
};

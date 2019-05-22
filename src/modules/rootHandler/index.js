/* eslint-disable camelcase */
import { Wit, log } from 'node-wit';
import { reply } from '../facebook';
import Logger from '../../utils/logger';
import WitAIService from '../witai/witai.service';

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

const entityHandler = async (senderId, entities) => {
  const { intent, ...entityObj } = entities;
  const entityList = Object.keys(entityObj);
  const valueSet = entityList.reduce((acc, entity) => {
    const predictedArr = entityObj[entity];
    // eslint-disable-next-line no-underscore-dangle
    const valueList = predictedArr.map(predictedValue => predictedValue.value);

    valueList.forEach((value) => {
      acc.add(value);
    });
    return acc;
  }, new Set());
  const valueList = Array.from(valueSet);
  const intentList = intent.map(i => i.value);

  const reponseList = await WitAIService.getResponseList(
    intentList,
    entityList,
    valueList,
  );

  // console.log(reponseList);
  const reponsePromise = reponseList.map(responseObj => reply(senderId, responseObj.response));
  await Promise.all(reponsePromise);
};

// handle message response
const entitiesHandler = async (senderId, entities) => {
  // You can customize your response to these entities
  // For now, let's reply with another automatic message
  const { intent } = entities;
  if (!intent) {
    await reply(senderId, 'Sorry I don\'t understand it :(');
    return;
  }

  const promiseArr = [];
  for (let i = 0; i < intent.length; i++) {
    promiseArr.push(entityHandler(senderId, entities));
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

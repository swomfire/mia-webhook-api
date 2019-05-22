/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'crypto';
import Logger from '../../utils/logger';

dotenv.config();
// ----------------------------------------------------------------------------
// Messenger API specific code
// See the Send API reference
// https://developers.facebook.com/docs/messenger-platform/send-api-reference
const { FB_PAGE_TOKEN, FB_APP_SECRET } = process.env;
if (!FB_APP_SECRET) throw new Error('[HANDLER.JS] Missing FB_APP_SECRET');
if (!FB_PAGE_TOKEN) throw new Error('Missing FB_PAGE_TOKEN');

export const reply = async (id, text) => {
  try {
    const body = {
      recipient: { id },
      message: { text },
    };
    const messageApiUrl = `https://graph.facebook.com/me/messages?access_token=${encodeURIComponent(FB_PAGE_TOKEN)}`;
    const response = await axios.post(
      messageApiUrl,
      body,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
    return { response };
  } catch (error) {
    return { error };
  }
};


// verifying facebook webhook request
export function verifyRequestSignature(req, res, buf) {
  const signature = req.headers['x-hub-signature'];

  if (!signature) {
    // For testing, let's log an error. In production, you should throw an
    // error.
    Logger.error('Couldn\'t validate the signature.');
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

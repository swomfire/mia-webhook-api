/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import dotenv from 'dotenv';

// ----------------------------------------------------------------------------
// Messenger API specific code

// See the Send API reference
// https://developers.facebook.com/docs/messenger-platform/send-api-reference

dotenv.config();
const { FB_PAGE_TOKEN } = process.env;


if (!FB_PAGE_TOKEN) {
  throw new Error('Missing FB_PAGE_TOKEN');
}

export const reply = async (id, text) => {
  try {
    const body = {
      recipient: { id },
      message: { text },
    };
    const qs = `access_token=${encodeURIComponent(FB_PAGE_TOKEN)}`;
    const messageApiUrl = `https://graph.facebook.com/me/messages?${qs}`;
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

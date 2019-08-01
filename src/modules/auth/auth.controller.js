import BaseController from '../base/base.controller';
import httpStatus from 'http-status';
import { OAUTH2 } from '../../../oauth2-config';
const http = require('http');
const url = require('url');
const opn = require('open');
const destroyer = require('server-destroy');
const { google } = require('googleapis');

export const oauth2Client = new google.auth.OAuth2(
  OAUTH2.client_id,
  OAUTH2.client_secret,
  "http://localhost:3001/api/auth/oauth/callback",
);

/**
 * This is one of the many ways you can configure googleapis to use authentication credentials.  In this method, we're setting a global reference for all APIs.  Any other API you use here, like google.drive('v3'), will now use this auth client. You can also override the auth client at the service and method call levels.
 */
google.options({ auth: oauth2Client });


const scopes = ['https://www.googleapis.com/auth/dialogflow'];

async function authenticate() {
  return new Promise((resolve, reject) => {
    // grab the url that will be used for authorization
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes.join(' '),
    });
    const server = http
      .createServer()
      .listen(3000, () => {
        // open the browser to the authorize url to start the workflow
        opn(authorizeUrl, { wait: false }).then(cp => cp.unref());
      });
    destroyer(server);
  });
}

oauth2Client.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    // store the refresh_token in my database!
    oauth2Client.setCredentials({
      refresh_token: tokens.refresh_token
    });
    console.log(tokens.refresh_token);
  }
  console.log(tokens.access_token);
});

authenticate();
class AuthController extends BaseController {
  callback = async (req, res) => {
    const { query } = req;
    const { code } = query
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    res.end('Authentication successful! Please return to the console.');
  }
}

export default new AuthController();


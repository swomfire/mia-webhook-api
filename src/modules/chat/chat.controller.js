import BaseController from '../base/base.controller';
import httpStatus from 'http-status';
import axios from 'axios';
import { oauth2Client } from '../auth/auth.controller';

const { DIALOG_FLOW_API } = process.env;

class ChatController extends BaseController {
  dialog = async (req, res) => {
    const { body } = req;
    const { content } = body;
    const { token } = await oauth2Client.getAccessToken();
    try {
      const result = await axios.post(DIALOG_FLOW_API, {
        queryInput: {
          text: {
            text: content,
            languageCode: "en"
          }
        },
        queryParams: {
          timeZone: "Asia/Saigon"
        }
      },
        {
          headers: { Authorization: "Bearer " + token }
        }
      );
      const { data } = result;
      return res.status(httpStatus.OK).send({ data });
    } catch (error) {
      const { response } = error;
      const { status, data } = response;
      return res.status(status).send({ data });
    }
  }
}

export default new ChatController();


import BaseController from '../base/base.controller';
import httpStatus from 'http-status';
import axios from 'axios';
import { oauth2Client } from '../auth/auth.controller';
import IntentResponseService from '../intentResponse/intentResponse.service';

const { DIALOGFLOW_API_URL, PROJECT_ID, INTENT_RESPONSE_API } = process.env;

const URL = `${DIALOGFLOW_API_URL}/${PROJECT_ID}`;
class ChatController extends BaseController {
  dialog = async (req, res) => {
    const { body } = req;
    const { content } = body;
    const { token } = await oauth2Client.getAccessToken();
    try {
      const result = await axios.post(`${URL}/${INTENT_RESPONSE_API}`, {
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

  hook = async (req, res) => {
    const { body } = req;
    const { queryResult } = body;
    // Get intent parameters
    const { parameters, intent } = queryResult;
    const data = await IntentResponseService.getResponseByParamsAndIntent(intent, parameters);
    return res.status(httpStatus.OK).send({ fulfillment_text: data.en });

  }
}

export default new ChatController();


import BaseController from '../base/base.controller';
import httpStatus from 'http-status';
import axios from 'axios';
import { oauth2Client } from '../auth/auth.controller';

const { DIALOGFLOW_API_URL, PROJECT_ID } = process.env;

const URL = `${DIALOGFLOW_API_URL}/${PROJECT_ID}`;

class DialogflowController extends BaseController {
  getIntentList = async (req, res) => {
    const { token } = await oauth2Client.getAccessToken();
    try {
      const result = await axios.get(`${URL}/agent/intents?intentView=INTENT_VIEW_FULL`,
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

  getEntityList = async (req, res) => {
    const { token } = await oauth2Client.getAccessToken();
    try {
      const result = await axios.get(`${URL}/agent/entityTypes`,
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

export default new DialogflowController();


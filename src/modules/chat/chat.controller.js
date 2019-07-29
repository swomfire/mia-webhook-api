import BaseController from '../base/base.controller';
import httpStatus from 'http-status';

class ChatController extends BaseController {
  diagram = async (req, res) => {
    const { body } = req;
    console.log('request:', body);
    return res.status(httpStatus.OK).send({ body });
  }
}

export default new ChatController();

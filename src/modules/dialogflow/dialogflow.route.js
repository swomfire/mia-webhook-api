import BaseRouter from '../base/base.route';
import DialogflowController from './dialogflow.controller';

class DialogflowRouter extends BaseRouter {
  constructor() {
    super(DialogflowController);
    this.router.get('/intent/list', DialogflowController.getIntentList);
    this.router.get('/entity/list', DialogflowController.getEntityList);
  }
}
export default new DialogflowRouter(DialogflowController);

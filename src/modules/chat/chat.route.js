import BaseRouter from '../base/base.route';
import ChatController from './chat.controller';

class ChatRouter extends BaseRouter {
  constructor() {
    super(ChatController);
    this.router.post('/diagram', ChatController.diagram);
  }
}
export default new ChatRouter(ChatController);

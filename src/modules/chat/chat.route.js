import BaseRouter from '../base/base.route';
import ChatController from './chat.controller';

class ChatRouter extends BaseRouter {
  constructor() {
    super(ChatController);
    this.router.post('/dialog', ChatController.dialog);
  }
}
export default new ChatRouter(ChatController);

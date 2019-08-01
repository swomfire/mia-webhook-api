import BaseRouter from '../base/base.route';
import AuthController from './auth.controller';

class ChatRouter extends BaseRouter {
  constructor() {
    super(AuthController);
    this.router.get('/oauth/callback', AuthController.callback);
  }
}
export default new ChatRouter(AuthController);

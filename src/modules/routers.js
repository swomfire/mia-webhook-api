import express from 'express';
/* routers */
import ChatRouter from './chat/chat.route';
import AuthRouter from './auth/auth.route';

const router = express.Router();

export default () => {
  router.use('/chats', ChatRouter.router);
  router.use('/auth', AuthRouter.router);
  return router;
};

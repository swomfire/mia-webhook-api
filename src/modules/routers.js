import express from 'express';
/* routers */
import ChatRouter from './chat/chat.route';
import DialogflowRouter from './dialogflow/dialogflow.route';
import AuthRouter from './auth/auth.route';

const router = express.Router();

export default () => {
  router.use('/chats', ChatRouter.router);
  router.use('/dialogflow', DialogflowRouter.router);
  router.use('/auth', AuthRouter.router);
  return router;
};

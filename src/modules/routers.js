import express from 'express';
/* routers */
import ChatRouter from './chat/chat.route';

const router = express.Router();

export default () => {
  router.use('/chats', ChatRouter.router);
  return router;
};

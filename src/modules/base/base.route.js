import express from 'express';

export default class BaseRouter {
  constructor(controller) {
    this.controller = controller;
    this.router = express.Router();
    this.router.post('/', this.controller.insert); // insert
    this.router.put('/:id', this.controller.update); // update by id
    this.router.delete('/:id', this.controller.delete); // delete
    this.router.get('/', this.controller.getAll); // get all
    this.router.get('/:id', this.controller.get); // get by Id
    this.router.param('id', this.controller.load);
  }
}

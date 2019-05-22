import httpStatus from 'http-status';
import mongoose from 'mongoose';
import _ from 'lodash';
import APIError, { ERROR_MESSAGE } from '../../utils/APIError';
import Logger from '../../utils/logger';

const emptyObjString = '{}';

export default class BaseController {
  constructor(service) {
    this.service = service;
    this.handleError.bind(this);
  }

  handleError(res, error) {
    Logger.error(error.message);
    const status = error.status || httpStatus.INTERNAL_SERVER_ERROR;
    return res.status(status).send(error.message);
  }

  load = async (req, res, next, id) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        const { CONTENT_NOT_FOUND } = ERROR_MESSAGE;
        throw new APIError(CONTENT_NOT_FOUND, httpStatus.BAD_REQUEST);
      }
      const model = await this.service.get(id);

      if (model == null) {
        const { CONTENT_NOT_FOUND } = ERROR_MESSAGE;
        throw new APIError(CONTENT_NOT_FOUND, httpStatus.NOT_FOUND);
      }

      req.model = model;
      return next();
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  insert = async (req, res) => {
    try {
      const data = req.body;
      const result = await this.service.insert(data);
      return res.status(httpStatus.OK).send(result);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  update = async (req, res) => {
    try {
      const { model } = req;
      const newModel = req.body;
      _.assign(model, newModel);

      const savedModel = await model.save();
      return res.status(httpStatus.OK).send(savedModel);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  get = async (req, res) => {
    try {
      const { model } = req;

      return res.status(httpStatus.OK).send(model);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  getAll = async (req, res) => {
    try {
      const {
        skip, limit, sort, ...params
      } = req.query;
      const option = { skip, limit };
      if (sort) {
        const sortObj = JSON.parse(sort);
        option.sort = sortObj;
      }
      const query = JSON.parse(_.get(params, 'query', emptyObjString));
      const result = await this.service.getAll(query, option);
      return res.status(httpStatus.OK).send(result);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  delete = async (req, res) => {
    try {
      const { model } = req;
      model.deleted = true;
      const deleteModel = await model.save();
      return res.status(httpStatus.OK).send(deleteModel);
    } catch (error) {
      return this.handleError(res, error);
    }
  }
}

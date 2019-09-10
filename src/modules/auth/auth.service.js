import AuthCollection from './auth.model';
import _isEmpty from 'lodash/isEmpty';
import BaseService from '../base/base.service';


class AuthService extends BaseService {
  constructor() {
    super(AuthCollection);
  }

  getToken() {
    return AuthCollection.findOne().exec();
  }
}

export default new AuthService();

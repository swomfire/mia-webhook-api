/* eslint-disable camelcase */
import witAiCollection from './witai.model';
import BaseService from '../base/base.service';

class WitAIService extends BaseService {
  constructor() {
    super(witAiCollection);
    this.getResponseList.bind(this);
  }

  getResponseList(intentNameList, entityList, valueList) {
    return this.collection.find({
      intent_name: {
        $in: intentNameList,
      },
      entity_name: {
        $in: entityList,
      },
      entity_value: {
        $in: valueList,
      },
    });
  }
}

export default new WitAIService();

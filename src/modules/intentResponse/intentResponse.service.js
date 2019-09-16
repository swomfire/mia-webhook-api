import intentResponseCollection from './intentResponse.model';
import _isEmpty from 'lodash/isEmpty';
import BaseService from '../base/base.service';
import { getIntentId } from './intentResponse.utils';
import IntentCollection from '../intent/intent.model';


class IntentResponseService extends BaseService {
  constructor() {
    super(intentResponseCollection);
  }

  async getResponseByParamsAndIntent(intent, parameters) {
    const intentId = getIntentId(intent.name);
    const refinedArray = [];
    const intentDB = await IntentCollection.findOne({ intentId }).exec();
    const defaultResponse = { en: 'No Solution' };
    if (intentDB) {
      const parameterIds = [];
      intentDB.parameters.forEach(({ parameterId, displayName }) => {
        if (parameters[displayName]) {
          parameterIds.push(parameterId);
          refinedArray.push(
            {
              parameterId,
              displayName,
              value: parameters[displayName],
            }
          );
        }
      });
      const responses = await this.collection.find({
        intentId: intentDB._id,
        parameters: {
          $elemMatch: { parameterId: { $in: parameterIds } },
        },
      }).exec();
      let finalResponse = defaultResponse;
      responses.some(({ parameters: parameterDBs, response: solution }) => {
        let responseFinded = true;
        refinedArray.some(({ value, parameterId }) => {
          const param = parameterDBs.find(param => param.parameterId === parameterId);
          if (!param || param.value !== value) {
            responseFinded = false;
            return true;
          }
        });
        if (responseFinded) {
          finalResponse = solution;
          return true;
        }
      });
      return finalResponse;
    }
    return defaultResponse;
  }
}

export default new IntentResponseService();

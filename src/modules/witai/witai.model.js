import mongoose from 'mongoose';
import moment from 'moment';

const currentDateUtc = () => moment().utc().format();

const { Schema } = mongoose;

const witAiSchema = new Schema(
  {
    user_input: {
      type: String,
      required: true,
    },
    intent_name: {
      type: String,
      required: true,
    },
    entity_name: String,
    entity_value: String,
    response: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: currentDateUtc,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    versionKey: false,
    collection: 'witai',
  },
);

export default mongoose.model('witai', witAiSchema);

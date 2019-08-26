import mongoose from 'mongoose';
const { Schema } = mongoose;

const parameterSchema = new Schema({
  parameterId: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});


const responseSchema = new Schema({
  vn: {
    type: String,
    required: true,
    default: 'phản hồi bằng VN',
  },
  en: {
    type: String,
    required: true,
    default: 'response in EN',
  },
});

const intentResponseSchema = new Schema(
  {
    intentId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    parameters: {
      type: [parameterSchema],
      required: true,
    },
    response: {
      type: responseSchema,
      required: true,
      default: {
        vn: 'phản hồi bằng VN',
        en: 'response in EN',
      },
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    versionKey: false,
    collection: 'response',
  },
);

export default mongoose.model('Response', intentResponseSchema);

import mongoose from 'mongoose';
const { Schema } = mongoose;

const parameterSchema = new Schema({
  parameterId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  entityTypeDisplayName: {
    type: String,
    required: true,
  },
  values: {
    type: [String],
    required: true,
    default: [],
  },
});

const intentSchema = new Schema(
  {
    intentId: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    parameters: {
      type: [parameterSchema],
      required: true,
      default: [],
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
    collection: 'intent',
  },
);

export default mongoose.model('Intent', intentSchema);

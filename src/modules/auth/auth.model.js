import mongoose from 'mongoose';
const { Schema } = mongoose;

const authSchema = new Schema({
  access_token: String,
  refresh_token: String,
  scope: String,
  token_type: String,
  expiry_date: Number,
},
  {
    versionKey: false,
    collection: 'auth-webhook',
  },
);

export default mongoose.model('AuthWebhook', authSchema);

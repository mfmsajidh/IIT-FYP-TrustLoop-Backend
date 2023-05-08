import { Schema, model, SchemaTypes } from 'mongoose';

const postSchema = new Schema({
  image: { data: Buffer, contentType: String },
  condition: { type: String, required: true },
  category: { type: String, required: true },
  postTitle: { type: String, required: true },
  serialNumber: { type: String, required: false, unique: true },
  price: { type: String, required: true },
  value: { type: String, required: true },
  userId: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
  },
  transactionHistory: [
    {
      stellarUserPublicKey: String,
      previousStellarTransactionId: String,
      stellarTransactionId: String,
      ipfsHash: String,
      timestamp: Date,
      transactionType: String,
    },
  ],
  traded: { type: Boolean, default: false },
});

const Post = model('Post', postSchema);

export default Post;

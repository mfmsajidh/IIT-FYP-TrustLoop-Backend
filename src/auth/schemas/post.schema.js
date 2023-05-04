import { Schema, model } from 'mongoose';

const postSchema = new Schema({
  image: { data: Buffer, contentType: String },
  condition: { type: String, required: true },
  category: { type: String, required: true },
  postTitle: { type: String, required: true },
  serialNumber: { type: String, required: false },
  price: { type: String, required: false },
  value: { type: String, required: false },
});

const Post = model('Post', postSchema);

export default Post;

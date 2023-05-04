import User from '../schemas/auth.schema.js';
import { getToken } from '../../utility/utils.js';
import Post from '../schemas/post.schema.js';
import PostSchema from '../schemas/post.schema.js';
import fs from 'node:fs';
import path from 'node:path';

export const addPostService = async (req) => {
  try {
    const { condition, category, postTitle, serialNumber, price, value } =
      req.body;

    const image = {
      data: fs.readFileSync(req.file.path),
      contentType: 'image/png',
    };

    if (
      !condition ||
      !category ||
      !postTitle ||
      !serialNumber ||
      !price ||
      !value
    ) {
      throw new Error('Invalid fields');
    }

    const post = await Post.findOne({ serialNumber });
    if (post) {
      throw new Error('Post Exist');
    }

    await PostSchema.create({
      image,
      condition,
      category,
      postTitle,
      serialNumber,
      price,
      value,
    });
  } catch (error) {
    throw new Error('Post creation failed');
  }
};

export const getAllPostsService = async () => {
  try {
    return await Post.find();
  } catch (error) {
    throw new Error('Get all posts failed');
  }
};

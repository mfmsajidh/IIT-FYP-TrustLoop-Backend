import { loginService, registerService } from '../services/auth.service.js';
import { generateResponse } from '../../utility/utils.js';
import {
  addPostService,
  getAllPostsService,
} from '../services/post.service.js';

export const addPostController = async (req, res) => {
  try {
    const response = await addPostService(req);
    return generateResponse(res, 200, false, 'Post creation success', response);
  } catch (error) {
    return generateResponse(res, 500, true, error.message);
  }
};

export const getAllPostsController = async (req, res) => {
  try {
    const response = await getAllPostsService();
    return generateResponse(res, 200, false, 'Get all posts success', response);
  } catch (error) {
    return generateResponse(res, 500, true, error.message);
  }
};

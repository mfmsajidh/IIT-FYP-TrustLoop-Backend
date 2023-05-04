import { loginService, registerService } from '../services/auth.service.js';
import { generateResponse } from '../../utility/utils.js';
import { addPostService } from '../services/post.service.js';

export const addPostController = async (req, res) => {
  try {
    const response = await addPostService(req);
    return generateResponse(res, 200, false, 'Post creation success', response);
  } catch (error) {
    return generateResponse(res, 500, true, error.message);
  }
};

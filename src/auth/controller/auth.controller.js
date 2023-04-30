import { loginService, registerService } from '../services/auth.service.js';
import { generateResponse } from '../../utility/utils.js';

export const registerController = async (req, res) => {
  try {
    const response = await registerService(req);
    return generateResponse(res, 200, false, 'User creation success', response);
  } catch (error) {
    return generateResponse(res, 500, true, error.message);
  }
};

export const loginController = async (req, res) => {
  try {
    const response = await loginService(req);
    return generateResponse(res, 200, false, 'User login success', response);
  } catch (error) {
    return generateResponse(res, 500, true, error.message);
  }
};

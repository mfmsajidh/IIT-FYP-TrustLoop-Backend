import * as jwt from 'jsonwebtoken';
import { ENVIRONMENT } from '../config/configuration.js';
export const getToken = (email) => {
  return jwt.sign({ id: email }, ENVIRONMENT.jwtKey, { expiresIn: '2d' });
};

export const generateResponse = (res, statusCode, isError, message, data) => {
  return res.status(statusCode).json({
    isError,
    message,
    data,
  });
};

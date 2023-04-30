import { ENVIRONMENT } from '../config/configuration.js';
import jsonwebtoken from 'jsonwebtoken';

const { sign } = jsonwebtoken;

export const getToken = (email) => {
  return sign({ id: email}, ENVIRONMENT.jwtKey, {
    expiresIn: '2d',
  });
};

export const generateResponse = (res, statusCode, isError, message, data) => {
  return res.status(statusCode).json({
    isError,
    message,
    data,
  });
};

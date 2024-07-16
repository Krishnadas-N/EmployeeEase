import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { sendErrorResponse } from '../utils/responseHandlers'; 

export const validateLogin = [
  body('email').isEmail().withMessage('Email is invalid'),
  body('password').notEmpty().withMessage('Password is required'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map(error => ({ message: error.msg }));
      return sendErrorResponse(res, 'Validation error', 400, formattedErrors);
    }
    next();
  }
];

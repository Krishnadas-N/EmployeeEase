import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Employee from '../models/Employee'; 
import { sendErrorResponse } from '../utils/responseHandlers'; 
import { Payload } from '../dtos/jwtPayloadModel';

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return sendErrorResponse(res, 'Authentication token missing', 401);
    }
    try {
        const decoded: Payload = jwt.verify(token, process.env.JWT_SECRET!) as Payload;
        if (decoded.role === 'employee') {
            const employee = await Employee.findById(decoded.id);
            if (!employee) {
                return sendErrorResponse(res, 'User not found or unauthorized', 401);
            }
        }
        req.user = decoded;
        next();
    } catch (err: unknown) {
        if (err instanceof jwt.TokenExpiredError) {
            return sendErrorResponse(res, 'Token expired', 401);
        } else if (err instanceof jwt.JsonWebTokenError) {
            return sendErrorResponse(res, 'Invalid token', 401);
        } else {
            return sendErrorResponse(res, 'Not authorized to access this resource', 401);
        }
    }
};

import { Request, Response, NextFunction } from 'express';
import { sendErrorResponse } from '../utils/responseHandlers';
import { assertHasUser } from '../utils/requestWithUser';


export const authorizeRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        assertHasUser(req);
        if (!allowedRoles.includes(req.user.role)) {
            return sendErrorResponse(res, 'Unauthorized access', 403);
        }
        next();
    };
};

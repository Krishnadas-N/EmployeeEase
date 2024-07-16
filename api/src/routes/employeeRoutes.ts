import express from 'express';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { authorizeRole } from '../middlewares/authorizeRole';
import { getEmployeeProfile } from '../controllers/employeeController';

const employeeRouter = express.Router();

employeeRouter.use(authenticateJWT);
employeeRouter.use(authorizeRole(['employee']));

employeeRouter
    .route('/profile')
    .get(getEmployeeProfile);

export default employeeRouter;

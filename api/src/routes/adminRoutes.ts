import express from 'express';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { authorizeRole } from '../middlewares/authorizeRole';
import { addEmployee, updateEmployee, deleteEmployee, getEmployees } from '../controllers/adminController';

const adminRouter = express.Router();

adminRouter.use(authenticateJWT);
adminRouter.use(authorizeRole(['admin']));

adminRouter
    .route('/employees')
    .post(addEmployee)
    .get(getEmployees);

adminRouter
    .route('/employees/:id')
    .put(updateEmployee)
    .delete(deleteEmployee);

export default adminRouter;

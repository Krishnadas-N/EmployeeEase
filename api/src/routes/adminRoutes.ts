import express from 'express';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { authorizeRole } from '../middlewares/authorizeRole';
import { createEmployee, updateEmployee, deleteEmployee, getEmployees, getLocationAndDesignationDetails, getDashBoardDetails } from '../controllers/adminController';

const adminRouter = express.Router();

adminRouter.use(authenticateJWT);
adminRouter.use(authorizeRole(['admin']));

adminRouter
    .route('/employees')
    .post(createEmployee)
    .get(getEmployees);

adminRouter
    .route('/employees/:id')
    .put(updateEmployee)
    .delete(deleteEmployee);

adminRouter.get('/details', getLocationAndDesignationDetails);
adminRouter.get('/dashboard', getDashBoardDetails);


export default adminRouter;

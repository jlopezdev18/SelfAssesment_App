import express from 'express';
import { addUserToCompany, createCompany, deleteCompany, getCompanies } from '../controllers/companyController';

const router = express.Router();

router.get('/companies', getCompanies);
router.post('/create-company', createCompany);
router.post('/add-user-to-company', addUserToCompany);
router.delete('/delete-company/:companyId', deleteCompany); // Assuming deleteCompany is defined in the controller


export default router;
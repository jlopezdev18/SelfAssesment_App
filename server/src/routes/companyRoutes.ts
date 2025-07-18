import express from 'express';
import { addUserToCompany, createCompany, deleteCompany, deleteUserFromCompany, getCompanies, updateCompany, updateUserInCompany } from '../controllers/companyController';

const router = express.Router();

router.get('/companies', getCompanies);
router.post('/create-company', createCompany);
router.post('/add-user-to-company', addUserToCompany);
router.put('/update-user/:userId', updateUserInCompany);
router.put('/update-company/:companyId', updateCompany);
router.delete('/delete-company/:companyId', deleteCompany);
router.delete('/delete-user/:companyId/:userId', deleteUserFromCompany);

export default router;
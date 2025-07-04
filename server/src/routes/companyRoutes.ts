import express from 'express';
import { createCompany, getCompanies } from '../controllers/companyController';

const router = express.Router();

router.get('/companies', getCompanies);
router.post('/create-company', createCompany);


export default router;
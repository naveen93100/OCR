import { Router } from 'express'
import { scanCard, createLead,getLeadHistory } from '../controller/executiveController.js';
import upload from '../middleware/multer.js';
import { isAuth } from '../middleware/isAuth.js';

const router = Router();


router.post('/scan-card', isAuth, upload.single('cardImg'), scanCard);

router.post('/create-lead', isAuth,createLead);

router.get('/history',isAuth,getLeadHistory);

export default router;
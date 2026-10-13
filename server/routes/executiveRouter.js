import { Router } from 'express'
import { scanCard, createLead,getLeadHistory ,downloadExecutiveLeads,uploadCard} from '../controller/executiveController.js';
import upload from '../middleware/multer.js';
import { isAuth } from '../middleware/isAuth.js';

const router = Router();


router.post('/scan-card', isAuth, upload.single('cardImg'), scanCard);

router.post('/upload-card',isAuth,upload.single('cardImg'),uploadCard);

router.post('/create-lead', isAuth,createLead);

router.get('/history',isAuth,getLeadHistory);

router.get('/excel',isAuth,downloadExecutiveLeads);



export default router;
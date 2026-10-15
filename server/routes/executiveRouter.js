import { Router } from 'express'
import { scanCard, getLeadHistory, downloadExecutiveLeads, uploadCard, bulkUpload, getPendingCards,updateCard,updateCardStatus } from '../controller/executiveController.js';
import { compressCards } from '../middleware/multer.js';
import { isAuth } from '../middleware/isAuth.js';

const router = Router();

router.post('/bulk-upload', isAuth, compressCards, bulkUpload);

router.post('/scan-single', isAuth, compressCards, scanCard);

router.get('/pending-cards', isAuth, getPendingCards);

router.patch('/update-card/:cardId',isAuth,updateCard);

router.post('/change-status/:cardId',isAuth,updateCardStatus);

// -------------------------


router.get('/history', isAuth, getLeadHistory);

router.get('/excel', isAuth, downloadExecutiveLeads);



export default router;
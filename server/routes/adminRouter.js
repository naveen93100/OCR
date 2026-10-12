import express from 'express'
import { createMarketingPerson,createAdmin,getDashBoardData, downloadExcel,getExecutiveLeads} from '../controller/adminController.js';


const router = express.Router();

router.get('/',getDashBoardData);
router.post('/create-admin',createAdmin);
router.get('/:executiveUserId',getExecutiveLeads);
// 
router.post('/create-marketing-person',createMarketingPerson);

router.get('/download-excel',downloadExcel);


export default router;

import express from 'express'
import { createMarketingPerson,createAdmin,getDashBoardData, downloadExcel,getExecutiveLeads, exportExecutiveLeads} from '../controller/adminController.js';


const router = express.Router();

router.get('/',getDashBoardData);
router.post('/create-admin',createAdmin);
router.get('/:executiveUserId',getExecutiveLeads);

// particular
router.get('/:executiveUserId/export',exportExecutiveLeads);


// 

router.post('/create-marketing-person',createMarketingPerson);

// main
router.get('/download-excel',downloadExcel);


export default router;



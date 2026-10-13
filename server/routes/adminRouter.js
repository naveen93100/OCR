import express from 'express'
import { createMarketingPerson,createAdmin,getDashBoardData, downloadExcel,getExecutiveLeads, exportExecutiveLeads} from '../controller/adminController.js';


const router = express.Router();

router.get('/',getDashBoardData);
router.post('/create-admin',createAdmin);
router.post('/create-marketing-person',createMarketingPerson);


router.get('/download-excel',downloadExcel);

router.get('/:executiveUserId/export',exportExecutiveLeads);

router.get('/:executiveUserId',getExecutiveLeads);


export default router;



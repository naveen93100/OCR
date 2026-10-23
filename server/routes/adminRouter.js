import express from 'express'
import { createMarketingPerson,createAdmin,getDashBoardData, downloadExcel,getExecutiveLeads, exportExecutiveLeads,getAllLeads,getAllExecutive} from '../controller/adminController.js';
import { isAdmin } from '../middleware/isAdmin.js';


const router = express.Router();


router.get('/',getDashBoardData);
router.get('/all-leads',isAdmin,getAllLeads);
router.get('/all-executive',isAdmin,getAllExecutive);


router.post('/create-admin',isAdmin,createAdmin);
router.post('/create-executive-person',isAdmin,createMarketingPerson);


router.get('/download-excel',isAdmin,downloadExcel);

router.get('/:executiveUserId/export',isAdmin,exportExecutiveLeads);

router.get('/:executiveUserId',isAdmin,getExecutiveLeads);


export default router;



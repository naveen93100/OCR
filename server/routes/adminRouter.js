import express from 'express'
import { createMarketingPerson,createAdmin,getDashBoardData, downloadExcel,getExecutiveLeads, exportExecutiveLeads,getAllLeads,getAllExecutive} from '../controller/adminController.js';
import { isAdmin } from '../middleware/isAdmin.js';


const router = express.Router();

router.get('/',getDashBoardData);
router.get('/all-leads',getAllLeads);
router.get('/all-executive',isAdmin,getAllExecutive);

router.post('/create-admin',createAdmin);
router.post('/create-executive-person',createMarketingPerson);


router.get('/download-excel',downloadExcel);

router.get('/:executiveUserId/export',exportExecutiveLeads);

router.get('/:executiveUserId',getExecutiveLeads);


export default router;



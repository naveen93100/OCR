import express from 'express'
import { createMarketingPerson,createAdmin} from '../controller/adminController.js';


const router=express.Router();

router.post('/create-admin',createAdmin)
// 
router.post('/create-marketing-person',createMarketingPerson);

// router.post('/download-excel',downloadExcel);




export default router;
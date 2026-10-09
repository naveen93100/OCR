import express from 'express'
import { createMarketingPerson,createAdmin,getDashBoardData} from '../controller/adminController.js';


const router = express.Router();

router.get('/',getDashBoardData);
router.post('/create-admin',createAdmin)
// 
router.post('/create-marketing-person',createMarketingPerson);

// router.post('/download-excel',downloadExcel);

export default router;

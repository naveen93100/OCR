import express from 'express'
import { createMarketingPerson,createAdmin,getDashBoardData, downloadExcel} from '../controller/adminController.js';


const router = express.Router();

router.get('/',getDashBoardData);
router.post('/create-admin',createAdmin);
// 
router.post('/create-marketing-person',createMarketingPerson);

router.get('/download-excel',downloadExcel);


export default router;

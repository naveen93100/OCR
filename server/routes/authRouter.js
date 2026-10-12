import express from 'express'
import { login, logout,refreshToken } from '../controller/authController.js';


const router = express.Router();

router.post('/login', login);
router.post('/logout',logout);

router.get('/refresh-token',refreshToken);





export default router;
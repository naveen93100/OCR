import express from 'express'
import adminRouter from './adminRouter.js'
import authRouter from './authRouter.js'
import executiveRouter from './executiveRouter.js'


const router=express.Router();


router.use('/executive',executiveRouter);

router.use('/auth',authRouter);

router.use('/admin',adminRouter);


export default router;
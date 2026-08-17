import { Router } from 'express'
import openReports from './openReports.js';
import openUsers from './openUser.js';

const authRouter = Router();

authRouter.use('/users', openUsers)
authRouter.use('/reports', openReports)

export default authRouter
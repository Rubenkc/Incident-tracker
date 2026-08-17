import { Router } from 'express';
import secureReport from './secureReport.js';
import secureUser from './secureUser.js';
import { requireAdmin } from '../utils/autho.js';
import adminRouter from './admin.js';

const apiRouter = Router();

apiRouter.use('/admin', requireAdmin, adminRouter)
apiRouter.use('/me', secureUser)
apiRouter.use('/report', secureReport)

export default apiRouter
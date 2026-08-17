import { Router } from 'express'
import { getAllUsersAdmin, updateUserRoleAdmin, deleteUser, updateUserStatusAdmin } from '../../db/queries/users.js';
import tryCatch from '../utils/util.js';
import { adminGetAllPendingReports, updateReportStatusAdmin, adminDeleteReport} from '../../db/queries/reports.js';
import { errorCreator } from '../utils/errors.js';
import pool from '../../db/index.js'

const adminRouter = Router();

adminRouter.get('/users', tryCatch(async (req, res, next) => {
    const client = req.app.get('db') || pool
    const {role, id} = req.user


    const users = await getAllUsersAdmin(id, role, client);

    res.status(200).json({users:users, message:"Successfully retrieved users"})
}));

adminRouter.patch('/user/role/:id', tryCatch(async (req, res, next) => {
    const id = Number(req.params.id);
    const {newRole} = req.body
    const db = req.app.get('db') || pool

    const roles = ['admin', 'user', 'guest'].includes(newRole.toLowerCase())

   if(!roles) throw errorCreator(`The role doesnt exist`, "INVALID_INPUT", 400)



    const user = await updateUserRoleAdmin(id, newRole, db)

  res.status(200).json({result:user, message:"User role updated successfully"})
}));

adminRouter.patch('/user/status/:id', tryCatch(async(req, res, next) => {
    const {status} = req.body;
    const id = Number(req.params.id)
    const db = req.app.get('db') || pool

    if(typeof status !== 'boolean') throw errorCreator("Invalid status", 'INVALID SYNTAX', 400)

    const user = await updateUserStatusAdmin(id, status, db);

    res.status(200).json({result: user, message:"User status updated correctly"})
}));

adminRouter.delete('/user/:id', tryCatch(async(req, res, next) => {
    const id = Number(req.params.id)
    const db = req.app.get('db') || pool

    const result = await deleteUser(id, db)

    res.status(200).json({result, message:"Successfuly deleted user."})
}));

adminRouter.patch('/report/status/:id', tryCatch(async(req, res, next) => {
    const {status} = req.body;
    const id = Number(req.params.id)
    const db = req.app.get('db') || pool

    const check = ['approved', 'declined', 'pending'].includes(status.toLowerCase())

    if(!check) throw errorCreator("Invalid status", "INVALID_STATUS", 400)

    const report = await updateReportStatusAdmin(id, status, db)

    res.status(200).json({result:report, message:'Successfully updated report status'})


}));

adminRouter.get('/reports/pending', tryCatch(async(req, res, next) => {
    const db = req.app.get('db') || pool
    
    const reports = await adminGetAllPendingReports(db)

    res.status(200).json({result: reports, message:"Successfully retrieved all pending reports"})

}))

adminRouter.delete('/report/:id', tryCatch(async(req, res, next) => {
    const id = Number(req.params.id)
    const db = req.app.get('db') || pool

    const report = await adminDeleteReport(id, db)

    res.status(200).json({message: "Successfuly deleted report", result:report})

}))

export default adminRouter;
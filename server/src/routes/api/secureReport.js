import { Router } from 'express'
import { getReportByUserId, getReportById, updateReport, deleteReport, createReport } from '../../db/queries/reports.js';
import tryCatch from '../utils/util.js';
import { errorCreator } from '../utils/errors.js';
import pool from '../../db/index.js'

const secureReport = Router();

secureReport.get('/:id', tryCatch(async (req, res, next) => {
    const {id} = req.params

    const result = await getReportByUserId(id)

    

    res.status(200).json(result);

}));

secureReport.patch('/:id',  tryCatch( async (req, res, next) => {
    const id = Number(req.params.id)
    const userid = req.user.id
    const db = req.app.get('db') || pool
   
    if(typeof req.body !== 'object') throw errorCreator("Invalid data type", 'INAVLID_DATA', 409)
    
    
    const rep = await getReportById(id, db);

    console.log('re.status', rep.status)

    if (rep.status !== 'pending') throw errorCreator("Invalid Status must be pending in order to edit", "INAVALID_STATUS", 409)


    const fields = ['report', 'address'];
    

    const keyObj = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => {
        return fields.includes(key)
    }))
    
    

    console.log('key array', keyObj)

    if(Object.keys(keyObj).length !== Object.keys(req.body).length) throw errorCreator("Invalid fields", "INVALID_FIELDS", 400)


    const result = await updateReport(userid, id, keyObj, db)

       
    res.status(201).json({result});
      
}));

secureReport.delete('/:id', tryCatch(async (req, res, next) => {
    const {id} = req.user;
    const reportId = Number(req.params.id)
    const db = req.app.get('db') || pool


    const result = await deleteReport(id, reportId, db)


    res.status(200).json({message:"Successfully deleted report", result})
}));

secureReport.post('/create', tryCatch(async (req, res, next) => {

    const db = req.app.get('db') || pool
    const {id} = req.user
    const {report, address} = req.body;

    if(!report || !address) throw errorCreator("Missing input fields", "MISSING_INFORMATION", 400);

    const result = await createReport({report, address, user_id:id}, db);

    if(!result) throw errorCreator("Unable to create report", "FAILED_ATTEMPT", 500)

     res.status(201).json({result, message:"Successfully created report!"})
     


}));


export default secureReport;
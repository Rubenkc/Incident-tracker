import { Router } from 'express'
import { errorCreator } from '../utils/errors.js';
import tryCatch from '../utils/util.js';
import { getAllReports } from '../../db/queries/reports.js';

const openReports = Router();

openReports.get('/', tryCatch( async(req, res, next) => {
    const result = await getAllReports()

    if(!result){
        errorCreator('Unable to retrieve all reports', 'INVALID_ATTEMPT', 404);
    }

     res.status(200).json({result});
   
    
   
}) );



export default openReports
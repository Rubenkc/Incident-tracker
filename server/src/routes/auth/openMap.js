import { Router } from 'express'
import tryCatch from '../utils/util.js';
import { getNeigh } from '../../db/queries/map.js';

const neighborhoodRouter = Router();

neighborhoodRouter.get('/', tryCatch( async(req, res, next) => {
        const result = await getNeigh();

        res.status(200).json({result})
}))



export default neighborhoodRouter;
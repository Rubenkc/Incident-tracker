import express from 'express';
import apiRouter from './routes/api/index.js';
import authRouter from './routes/auth/index.js';
import neighborhoodRouter from './routes/auth/openMap.js';
import { privateCheck, publicCheck } from './routes/utils/util.js';
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit';



const app = express();

app.set('trust proxy', 1)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(cors())


const rate = rateLimit({
    windowMs: 10 * 60 * 1000,
    max:30,
    message: { error: 'Too many requests, try again later.' }
})

app.use('/auth', rate, authRouter );
app.use('/api', rate, privateCheck, apiRouter);
app.use('/neighborhoods', rate, neighborhoodRouter);


app.get('/health', (req, res, next) => {
    res.json({message:'Hello, connected to backend!'})
})

app.use((err, req, res, next) => {
    const {status} = err
    console.log(err.message)
    res.status(status).send({err})
})


export default app
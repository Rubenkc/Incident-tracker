
import app from '../app.js'
import request from 'supertest'
import pool from '../db/index.js';
import { createUserTokenTest, createNewUser, transactionStart, transactionEnd, updateReportStatus, requestHelper } from '../routes/utils/util.js';
import { createReport } from '../db/queries/reports.js';
import 'dotenv/config'

const req = request(app);
let client;
let user;

beforeEach( async() => {
   client = await transactionStart(pool, app)
})

afterEach( async() => await transactionEnd(client, app))


describe("/auth/reports", () => {
    
    it('GET /reports  returns 200 and json', async () => {
        const res = await requestHelper(req, 'get', '/auth/reports')
    
                
        expect(Array.isArray(res.body.result)).toBe(true)
        expect(res.body.result.length).toBeGreaterThanOrEqual(0)
    
})
    
})

describe('/api/report', () => {

    let token;
    let path = `/api/report`;
    let testReport;

    beforeEach(async() => {
        user = await createNewUser('test00000@test.com', 'test111', client);
        token = createUserTokenTest(user);
        testReport = await createReport({report:"Another test report lets do it", address:'1650 N saint louis', user_id:user.id}, client)

    })

    describe("POST /create route", () => {
        it('Creates a new report', async () => { //finish this good start, good job
            const body = {report:"This is the test report i hope it works", address:"1650 N saint lous ave"}
            const res = await requestHelper(req, 'post', `${path}/create`, token, {body, status:201})
            
            expect(res.body.message).toBe("Successfully created report!")
        })
    })
    
    describe('PATCH /:id route', () => {
        it('Edits report', async () => {
            const body = {report:"updated post", address:"1717 N saint louis"}
            const res = await  requestHelper(req, 'patch', `${path}/${testReport.id}`, token, {body, status:201})

            expect(res.body.result).toMatchObject({report:"updated post", address:"1717 N saint louis"})
        });

        it('Rejects, incorrect field', async() => {
            const body = {reports:"updated post", address:"1717 N saint louis"}
            const res = await requestHelper(req, 'patch', `${path}/${testReport.id}`, token, {body, status:400})

            expect(res.body.err).toMatchObject({code:"INVALID_FIELDS", message:"Invalid fields"})
        })

        it('Rejects, incorrect report status', async () => {
            const updReport = await updateReportStatus('approved', testReport.id, client);
            const body = {report:"updated post", address:"1717 N saint louis"}
            const res = await  requestHelper(req, 'patch', `${path}/${updReport.id}`, token, {body, status:409})

            expect(res.body.err).toMatchObject({message:"Invalid Status must be pending in order to edit"})
    })

        
    })
    
    describe('DELETE /:id route', () => {
        it('Deletes reports', async () => {
            
            const res = await requestHelper(req, 'delete', `${path}/${testReport.id}`, token)
               
            expect(res.body.result).toMatchObject({report:"Another test report lets do it"})

        })

        it('Throws an error for wrong report id', async() => {
            const res = await requestHelper(req, 'delete', `${path}/1000000`, token, {status:404})
            
            expect(res.body.err).toMatchObject({message:"Unable to delete post"})
        })
    })
}) 



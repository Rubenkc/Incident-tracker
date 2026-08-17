import request from 'supertest'
import 'dotenv/config'
import app from '../app.js'
import pool from '../db/index.js';
import { transactionStart, transactionEnd, createNewUser, createUserTokenTest, updateRole, requestHelper } from '../routes/utils/util.js';
import { createReport } from '../db/queries/reports.js';

const req = request(app);
let adminToken, client, user, report;


beforeEach(async() => {
    client = await transactionStart(pool, app);
    user = await createNewUser("test11@test.com", "ruben111", client);
    let newUser = await updateRole(user.id, 'admin', client)
    adminToken = createUserTokenTest(newUser);
});

afterEach(async() => await transactionEnd(client, app))


describe('/api/admin route', () => {

    const path = '/api/admin'

    describe('User admin routes', () => {

        describe('GET /users', () => {
            it("Gets all users", async() => {
                const res = await requestHelper(req, 'get', `${path}/users`, adminToken)
            
                expect(res.body.message).toBe("Successfully retrieved users")
            })
        });

        describe('PATCH /user/role/:id', () => {
            it("Changes a users role", async() => {
                const res = await requestHelper(req, 'patch',`${path}/user/role/${user.id}`, adminToken, { body:{newRole:'admin'}})

                expect(res.body.result).toMatchObject({role:'admin'})
            })

            it("Throws error when attempting to update with incorrect role", async() => {
                const res = await requestHelper(req, 'patch',`${path}/user/role/${user.id}`, adminToken, {status:400, body:{newRole:'admen'}})

                expect(res.body.err).toMatchObject({message:`The role doesnt exist`, code:"INVALID_INPUT"})
            })

            it("Throws an error if user is not found", async() => {
                const res = await requestHelper(req, 'patch',`${path}/user/role/111111111`, adminToken, { status:404, body:{newRole:'admin'}})

                expect(res.body.err).toMatchObject({message:"Unable to update user", code:"INVALID_ID"})
            })

        });
        
        describe('PATCH /user/status/:id', () => {
            it('Updates users account status', async() => {
                const res = await requestHelper(req, 'patch', `${path}/user/status/${user.id}`, adminToken, {body:{ status:true}})

                expect(res.body.result).toMatchObject({is_locked:true})
                expect(res.body.message).toBe("User status updated correctly")
                expect(res.body.result).toHaveProperty('is_locked', true)
            })

            it("Throws an error if the status is incorrect", async() => {
                const res = await requestHelper(req, 'patch', `${path}/user/status/${user.id}`, adminToken, {status:400, body:{ status:'true'}})

                expect(res.body.err).toMatchObject({message:"Invalid status", code:'INVALID SYNTAX'})
            })
        });

        describe('DELETE /user/:id', () => {
            it("Deletes a selected user", async() => {
                const res = await requestHelper(req, 'delete', `${path}/user/${user.id}`, adminToken)

                expect(res.body.message).toBe("Successfuly deleted user.")
            });

            it("Throws an error if the user doesnt exist", async() => {
                const res = await requestHelper(req, 'delete', `${path}/user/111111`, adminToken, {status:404})

                expect(res.body.err).toMatchObject({message:'User doesnt exist', code:"NOT_FOUND"})
            })
        })
        
    })

    describe('User report routes', () => {
    

        describe('GET /reports/pending', () => {
            it('Retrieves all pending reports', async() => {
                const res = await requestHelper(req, 'get', `${path}/reports/pending`, adminToken)
                
                expect(res.body.message).toBe("Successfully retrieved all pending reports")
                
            })

            
        });

        describe('PATCH /report/status/:id', () => {
            beforeEach(async() => {
                 report = await createReport({report:'test report', address:'1650 N fake st', user_id:user.id}, client)
            })
            it('Changes a reports status', async() => {
                const res = await requestHelper(req, 'patch', `${path}/report/status/${report.id}`, adminToken, {body:{ status: 'approved' } })
                
                expect(res.body.message).toBe('Successfully updated report status')
                expect(res.body.result).toHaveProperty('status', 'approved')
            })

            it('Throws an error if the status is invalid', async() => {
               const res = await requestHelper(req, 'patch', `${path}/report/status/${report.id}`, adminToken, {status:400, body:{ status: 'approve' } })

               expect(res.body.err).toMatchObject({message:"Invalid status", code:"INVALID_STATUS"})
            })
        });

        describe('DELETE /report/:id', () => {
            
            it("Deletes report", async() => {
                report = await createReport({report:'test report', address:'1650 N fake st', user_id:user.id}, client)
                const res = await requestHelper(req, 'delete', `${path}/report/${report.id}`, adminToken)
                
                
                expect(res.body.message).toBe("Successfuly deleted report")
                expect(res.body.result).toMatchObject({id:report.id, report:report.report})
            })

            it('Throws an error if no report is found', async() => {
                const res = await requestHelper(req, 'delete', `${path}/report/1111111`, adminToken, {status:404})

                expect(res.body.err).toMatchObject({message:"Cannot find report", code:"INVALID_ID"})
            })
        })
    })
})
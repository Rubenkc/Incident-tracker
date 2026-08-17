import request from "supertest";
import app from "../app.js";
import pool from "../db/index.js";
import { createUserTokenTest, createNewUser, transactionStart, transactionEnd, requestHelper } from "../routes/utils/util.js";
import 'dotenv/config'

let newtoken, client, user;
const req = request(app)

beforeEach(async() => {
    client = await transactionStart(pool, app)
    user = await createNewUser('test12000@gmail.com', 'Ruben1112', client)
});

afterEach(async() => {
    await transactionEnd(client, app);
});



describe("/auth/users open route", () => {

    const path = '/auth/users'

    describe('POST / route ', () => {
        it("Creates a new user", async() => {
         const res = await requestHelper(req, 'post', path, undefined, {status : 201, body:{ email:"fakemailgg@gmail.com", password:"ruben11123" }})
        
        expect(res.body.message).toBe("You've successfully created an account")
        });

        it("Throws error when missing field", async () => {
            const res = await requestHelper(req, 'post', path, undefined, { status : 400, body:{ password:"ruben11123" } })

            expect(res.body.err).toMatchObject({message:"Missing fields", code:"INVALID_INPUT"})
        })

        it("Throws an error when using an existing email", async() => {
            const res = await requestHelper(req, 'post', path, undefined, { status : 409, body:{ email: 'test12000@gmail.com',  password:"ruben11123" } })

            expect(res.body.err).toMatchObject({message:"Email already exists", code:"DUPE_EMAIL"})
        })
    });

    describe("POST /signin route", () => {
        it('logs in sucessfully /POST', async() => {
            const res = await requestHelper(req, 'post', `${path}/signin`, undefined, { status:201, body:{ password:'Ruben1112', email:user.email } })

            expect(res.body.message).toBe("Log in successful")
        })

        it("Throws error when missing field", async () => {
            const res = await requestHelper(req, 'post', `${path}/signin`, undefined, { status:400, body:{ password:'Ruben1112' } })

            expect(res.body.err).toMatchObject({message:"Missing fields", code:"MISSING_FIELDS"})
        })

        it("Throws error when password is incorrect", async () => {
            const res = await requestHelper(req, 'post', `${path}/signin`, undefined, { status:401, body:{ password:'Ruben111', email:user.email } });

            expect(res.body.err).toMatchObject({message:"Incorrect password try again", code:"INVALID_PASSWORD"})
        })
        
    })
});

describe("/api/me secure route", () => {
    const path = '/api/me'

    beforeEach(() => {
        newtoken = createUserTokenTest(user)
    })

    afterEach(() => {
        newtoken = null
    })

    describe('PATCH /password route', () => {
        it("Updates user password", async() => {
            const res = await requestHelper(req, 'patch',`${path}/password`, newtoken, { body: { password:"Ruben1112", newPassword:'Sophia1111' } })
        
            expect(res.body.message).toBe("Password successfully changed!")
        });

        it("Missing input field", async () => {
            const res = await requestHelper(req, 'patch',`${path}/password`, newtoken, { status:400, body: { password:"Ruben1112" } })

            expect(res.body.err).toMatchObject({message:"Missing input fields", code:"MISSING_FIELDS"})
        
        })

        it("Old password matches new password", async() => {
            const res = await requestHelper(req, 'patch',`${path}/password`, newtoken, { status:422, body: { password:"Sophia1111", newPassword:'Sophia1111' } })

            expect(res.body.err).toMatchObject({message:"Old password must not match new password", code:"INVALID_ATTEMPT"})
        })

        it("Old password is incorrect", async() => {
            const res = await requestHelper(req, 'patch',`${path}/password`, newtoken, { status:400, body: { password:"Ruben111", newPassword:'Sophia1111' } })

            expect(res.body.err).toMatchObject({message:"Incorrect password", code:"INVALID_PASSWORD"})
        })
    })
    

    describe('PATCH /status route', () => {
        it("Updates user's account status", async() => {
            const res = await requestHelper(req, 'patch', `${path}/status`, newtoken, { body: { status:false } })

            expect(res.body.message).toBe("Successfully updated account status")
        })

        it("Contains incorrect data type", async() => {
            const res = await requestHelper(req, 'patch', `${path}/status`, newtoken, { status:400, body: { status:'false' } })

            expect(res.body.err).toMatchObject({message:"Incorrect status syntax", code:"INVALID_SYNTAX"})
        })
    })

    describe('PATCH /username route', () => {
        it('Updates the username', async() => {
            const res = await requestHelper(req, 'patch', `${path}/username`, newtoken, {body:{ username:'Newusername' }})

            expect(res.body.message).toBe("Successfully updated username")
        })

        it('Throws an error if username is missing', async() => {
            const res = await requestHelper(req, 'patch', `${path}/username`, newtoken, {status:400, body:{ username:''}})

            expect(res.body.err).toMatchObject({message:"Invalid username", code:"INVALID_SYNTAX"})
        })
    })
    
})

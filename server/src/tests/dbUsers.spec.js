import pool from '../db/index.js'
import { createNewUser, transactionEnd, transactionStart } from '../routes/utils/util.js';
import { emailAuth } from '../routes/utils/autho.js'
import { createUsername, getUserById, getPasswordByUserId, updateUserRoleAdmin, getUserByEmail, updatePassword } from '../db/queries/users.js'
import bcrypt from 'bcrypt';

let client;
let user;

 
describe("User test", () => {
    beforeEach( async() => {
        client = await transactionStart(pool)
        user = await createNewUser("hello@gmail.com", "Sophia1814", client)
    })

    afterEach( async() => await transactionEnd(client));

   //

    test("Duped email -> status 409", async() => {
        expect.assertions(1)
        await expect(createNewUser("hello@gmail.com", "Noah1814", client)).rejects.toMatchObject({message:"Email already exists", status:409})
    })

    test("validate email", () => {
        expect(emailAuth(" hello@gmail.com ")).toBe("hello@gmail.com")
        
    });

    test("Invalidate email", () => {
        expect.assertions(1)
        expect(() => emailAuth("invalid")).toThrow("Invalid email format");
    })

    test("Return created user", async () => {
        
        expect(user).toMatchObject({email:"hello@gmail.com", id:user.id})
    })

    test("Create username", async () => {
        const username = await createUsername({username:"Rubenko", id:user.id}, client)
        expect(username).toBe("Rubenko")
    })

    test("Unable to create username", async () => {
        expect.assertions(1)
        await expect(createUsername({id:undefined, username:"hello"}, client)).rejects.toThrow("Unable to create username")
    })

    test("Getting user by id", async () => {
        const userById = await getUserById(user.id, client)
        expect(userById).toMatchObject({username:null, id:user.id, email:"hello@gmail.com"})
    })

    it('Gets user by email', async() => {
        const retrievedUser = await getUserByEmail(user.email, client)
        expect(retrievedUser).toMatchObject({role:"user"})

     })

    test("Unable to get user by id, invalid id format -> 400", async () => {
        expect.assertions(1)
        await expect(getUserById("one", client)).rejects.toMatchObject({message:"Invalid id", status:400})
    });

    test("User not found, valid format but id doesnt exist -> 404", async() => {
        expect.assertions(1)

        await expect(getUserById(1000000000, client)).rejects.toMatchObject({message:"User doesnt exists", status:404})
    })

    test("Getting hashed password from db by id", async () => {
        const password = await getPasswordByUserId(user.id, client)

        expect(await bcrypt.compare("Sophia1814", password)).toBe(true)

    })

    test("Update password", async() => {
        const hashed_password = await bcrypt.hash('Newpasswordtest1', 1);
        const updatedUser = await updatePassword({hashed_password, id:user.id}, client);
        const password = await getPasswordByUserId(updatedUser.id, client);

        await expect(bcrypt.compare('Newpasswordtest1', password)).resolves.toBe(true)
    })

    test("Unable to retrieve password with id", async () => {
        expect.assertions(1)
        await expect(getPasswordByUserId(undefined, client)).rejects.toMatchObject({message:"Unable to locate user with provided id", status:400})
    })

    test("Update users role", async () => {

       await expect(updateUserRoleAdmin(user.id, 'guest', client )).resolves.toMatchObject({role:'guest'})
    })


});






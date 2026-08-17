import pool from "../db/index.js";
import { getReportById, updateReport, updateReportStatusAdmin, createReport } from "../db/queries/reports.js";
import { getUserById } from "../db/queries/users.js";
import { createNewUser, updateRole, transactionStart, transactionEnd } from "../routes/utils/util.js";


let client;
let user;
let newReport;

beforeEach(async() => {
        client = await transactionStart(pool)
        user = await createNewUser("rssss@gmail.com", "Ruben111", client)
        newReport = await createReport({report:"accident reported", address:"1650 N saint louis ave", user_id:user.id}, client)

    })

afterEach(async() => await transactionEnd(client))



test("does it work", () => {
    expect('test').toBe('test')
})

describe("Posts db table tests", () => {

    test("Create report", () => {
        expect(newReport).toMatchObject({report:"accident reported", address:"1650 N saint louis ave"})
    });

    test("Missing fields, unable to create report -> 400", async() => {
        expect.assertions(1)
        await expect(createReport({report:"accident reported"}, client)).rejects.toMatchObject({message:"Missing one or more fields", code:"MISSING_FIELD", status:400})
    })

    test("Get post by id", async() => {
        await expect(getReportById(newReport.id, client)).resolves.toMatchObject(newReport)
    })

    test("Invalid id format -> 400", async() => {
        expect.assertions(1)
       await expect(getReportById('invalid')).rejects.toMatchObject({message:"Invalid id format", code:"INCORRECT_FORMAT", status:400})
    })

    test("Id doesnt exist, report not found -> 404", async() => {
        expect.assertions(1)
        await expect(getReportById(99999999)).rejects.toMatchObject({message:"Report doesnt exists", code:"NOT_FOUND", status:404})
    })

    test("Updating report", async () => {
        await expect(updateReport(user.id, newReport.id, {address: "1740 N saint louis ave"}, client))
        .resolves
        .toMatchObject({address: "1740 N saint louis ave"})
    })

    test("Invalid user id, report not found -> 404", async() => {
        expect.assertions(1)
        await expect(updateReport(999999, newReport.id, {address: "1740 N saint louis ave"}, client))
        .rejects
        .toMatchObject({message:"Unable to update report", code:"REPORT_NOT_FOUND", status:404})
    })

    test("Invalid report status, -> 403", async () => {
        expect.assertions(1)
        await updateRole(user.id, 'admin', client);
        user = await getUserById(user.id, client)
        await updateReportStatusAdmin(newReport.id, 'denied', client)
        await expect(updateReport(user.id, newReport.id, {address: "1740 N saint louis ave"}, client))
        .rejects
        .toMatchObject({message:"Cannot edit reports that arent pending", code:"INVALID_REQUEST", status:403})

    })
    
})
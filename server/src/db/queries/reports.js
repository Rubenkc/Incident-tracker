import { errorCreator } from '../../routes/utils/errors.js'
import pool from '../index.js'

export async function getAllReports(db = pool){
    try{
        const {rows} = await db.query(`
            SELECT * FROM reports
            WHERE status = 'approved'
            `)
        
            return rows

            
    }catch(e){
        throw e
    }
}


export async function getReportById(id, db = pool){

   if(!Number.isSafeInteger(id) || id.length === 0) throw errorCreator("Invalid id format", "INCORRECT_FORMAT", 400)

  const {rows:[report]} = await db.query(`
            SELECT * FROM reports
            WHERE id=$1;
            `,[id]);

    if(!report) throw errorCreator("Report doesnt exists", "NOT_FOUND", 404)
        
        return report
   
};

export async function getReportByUserId(userId, db = pool){
    try{
        const {rows} = await db.query(`
            SELECT r.*
            FROM reports r
            JOIN users ON r.user_id = users.id
            WHERE users.id = $1
            ORDER BY r.created ASC;
            `,[userId])
            return rows
    }catch(e){
        throw e
    }
};

export async function createReport({report, address, user_id}, db = pool){

    if(!report || ! address) throw errorCreator("Missing one or more fields", "MISSING_FIELD", 400)

    try{
        const {rows:[rep]} = await db.query(`
           INSERT INTO reports(report, address, user_id)
           VALUES($1, $2, $3)
           RETURNING *;
            `, [report, address, user_id])

            return rep
    } catch(e){
        throw e
    }
};

export async function deleteReport(userId, reportId, db = pool){
    try{
        const {rows:[deletedRep]} = await db.query(`
            DELETE FROM reports 
            WHERE id = $1 AND user_id = $2
            RETURNING *;
            `, [reportId, userId]);

            if(!deletedRep) throw errorCreator("Unable to delete post", "INVALID_ID", 404)

            return deletedRep
    }catch(e){
        console.log(e)
        throw e

    }
}

export async function updateReport(userId, reportid, reportObject , db = pool){

    const keyArr = Object.keys(reportObject)
    const setString = keyArr.map((key, index) => {
        return `${key} = $${index + 1}`
    });

    const report = await getReportById(reportid, db);

    try{
        if(report.status !== 'pending') throw errorCreator("Cannot edit reports that arent pending", "INVALID_REQUEST", 403)

        const {rows:[updatedReport]} = await db.query(`
            UPDATE reports
            SET ${setString} 
            WHERE id = $${keyArr.length + 1} AND user_id = $${keyArr.length + 2}
            RETURNING *
            `,[...Object.values(reportObject), reportid, userId])

        if(!updatedReport) throw new errorCreator("Unable to update report", "REPORT_NOT_FOUND", 404)

            return updatedReport 

    }catch(e){
        throw e
    }
    
}

export async function updateReportStatusAdmin(reportId, status, db =pool){
    
    try{

        const {rows:[report]} = await db.query(`
            UPDATE reports
            SET status = $1
            WHERE id = $2
            RETURNING *;
            `, [status, reportId]);
        
        if(!report) throw errorCreator("No report found", "INVALID_ID", 400)

            return report

    } catch(e){
        throw e
    }

};

export async function adminGetAllPendingReports( db = pool){
    
    const {rows} = await db.query(`
        SELECT * FROM reports
        WHERE status = 'pending'
        `);


        return rows
}

export async function adminDeleteReport(id, db = pool){
    try{
        const {rows:[deletedReport]} = await db.query(`
            DELETE FROM reports
            WHERE id = $1
            RETURNING *
            `, [id])

            if(!deletedReport) throw errorCreator("Cannot find report", "INVALID_ID", 404)
    

            return deletedReport
    } catch(e){
        throw e
    }
}

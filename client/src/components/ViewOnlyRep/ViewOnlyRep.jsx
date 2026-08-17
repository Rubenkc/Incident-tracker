import useAuth from "../../hooks/useAuth"
import '../Reports/Report.css'
import '../UserReports/UserReport.css'

 export default function ViewReport({report}){

    const { user } = useAuth();

    return (
            <div className="ReportCard">

                <h2 className="CardUsername">{user.username ? user.username : 'No username'}</h2>
                <p>{report.report}</p>
                
                <div className="ReportDetails">
                    <h5>{`Status: ${report.status}`}</h5>
                    <h5>{`Address: ${report.address}`}</h5>
                    <h5>{report.created}</h5>
                </div>

            </div>    

            
    )
 }
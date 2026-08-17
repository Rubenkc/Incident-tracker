import { Login, Home, Nav, RequireAuth, CreateReport, CreateUser, UserRole, AdminHome, AdminNav, PendingReports, UserReports, AdminUsers, Activate, StatusCheck, EditReport, ResetPassword, EditUsername, DeleteUser, ApprovedReports, MapRender } from './components/index.js' 
import { Route, Routes } from 'react-router'
import useAuth from './hooks/useAuth.js'
import 'mapbox-gl/dist/mapbox-gl.css';

export function App() {
 const {isAuth} = useAuth();

  return (
    
   <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='login' element={<Login />} />
      <Route path='/createuser' element={<CreateUser />} />

     <Route  element={<RequireAuth />}>
         
         <Route path='/activate' element={<Activate />}/>

         <Route element={<StatusCheck />} >
         
            <Route element={<Nav />}>
               <Route path='/createreport' element= { <CreateReport /> } />
               <Route path='/reports' element={ <UserReports /> } /> 
               <Route path="/edit/:id" element={ <EditReport /> }/> 
               <Route path='/resetpassword' element={ <ResetPassword />}/>  
               <Route path='/username' element={<EditUsername />} />
               <Route path='/delete' element={<DeleteUser />} />
               <Route path='/viewreports' element={<ApprovedReports />} />
               <Route path='/map' element={<MapRender />}/>
            </Route>
            
            <Route element={<UserRole />}>
               <Route element={<AdminNav />}>
                  <Route path='/admin' element={<AdminHome />}/>
                  <Route path='/pending' element={<PendingReports />}/>
                  <Route path='/users' element={<AdminUsers/>}/>
               </Route>
            </Route> 

         </Route>   
      </Route> 
   </Routes>
  )
}

export default App

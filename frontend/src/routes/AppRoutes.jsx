import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Login from '../screens/Login'
import Register from '../screens/Register'
import Project from '../screens/Project.jsx'
import Projectdetails from '../screens/Projectdetails.jsx'
import UserAuth from '../auth/UserAuth'

const AppRoutes = () => {
  return (
    <BrowserRouter>
         <Routes>
            <Route path='/' element= { <Login/>} />
            <Route path='/register' element= { <Register/> } />
            <Route path='/projects' element= { <UserAuth> <Project/> </UserAuth>} />
            <Route path='/projects/:projectId' element= { <Projectdetails/> } />
         </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes

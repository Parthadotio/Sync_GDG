import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Login from '../screens/Login'
import Register from '../screens/Register'
import Project from '../screens/Project.jsx'
import ProjectDetails from '../screens/ProjectDetails'
import About from '../screens/about'
import UserAuth from '../auth/UserAuth'

const AppRoutes = () => {
  return (
    <BrowserRouter>
         <Routes>
            <Route path='/' element= { <Login/>} />
            <Route path='/about' element= { <About/> } />
            <Route path='/service' element= { <div>Service</div> } />
            <Route path='/contact' element= { <div>Contact</div> } />
            <Route path='/register' element= { <Register/> } />
            <Route path='/projects' element= { <UserAuth> <Project/> </UserAuth>} />
            <Route path='/projects/:projectId' element= { <ProjectDetails/> } />
         </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes

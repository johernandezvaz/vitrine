import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import AuthForm from './components/auth/AuthForm'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
// import ProjectDetails from './components/ProjectDetails'
// import ProjectUpdate from './components/ProjectUpdate'
import FileUpload from './components/FileUpload'

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<AuthForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/projects/:projectId" element={<ProjectDetails />} /> */}
          {/* <Route path="/projects/:projectId/edit" element={<ProjectUpdate />} />  */}
          <Route path="/upload" element={<FileUpload projectId={0} />} />
          {/* Add more routes as needed */}
        </Routes>
      </AuthProvider>
    </Router>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
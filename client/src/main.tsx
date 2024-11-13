import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import AuthForm from './components/auth/AuthForm.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthForm />
  </StrictMode>,
)

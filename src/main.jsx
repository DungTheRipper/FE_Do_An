import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from './App.jsx'
import AuthScreen from './components/AuthScreen.jsx'
import PasswordReset from './components/PasswordReset.jsx'
import ChangePassword from './components/ChangePassword.jsx'

import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthScreen />} />
        <Route path="/home" element={<App />} />
        <Route path="/reset" element={<PasswordReset />} />
        <Route path="/change" element={<ChangePassword />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

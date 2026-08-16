import React from 'react'
import AuthInput from './components/ui/AuthInput'
import Register from './pages/auth/Register'
import { BrowserRouter, Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthRoutes } from './routes/AuthRoutes'

const App = () => {
  return (
    <>
      <BrowserRouter>

        <Routes>

          {...AuthRoutes}

          {/* Global Fallback Route */}
          <Route path="*" element={<Navigate to="/register" replace />} />


        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
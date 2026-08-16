import React from 'react'
import AuthInput from './components/ui/AuthInput'
import Register from './pages/auth/Register'
import { BrowserRouter, Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthRoutes } from './routes/AuthRoutes'
import Home from './pages/Home'

const App = () => {
  return (
    <>
      <BrowserRouter>

        <Routes>

          {...AuthRoutes}

          {/* Global Fallback Route */}
          <Route key="register" path='/register' element={<Register />} />,
          <Route path='/' element={<Home />} />


        </Routes>

      </BrowserRouter>
    </>
  )
}

export default App
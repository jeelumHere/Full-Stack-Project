import React, { useState } from 'react'
import { BrowserRouter, Router, Routes, Route, Navigate } from "react-router-dom"
import Sidebar from './components/ui/Sidebar'
import Dasboard from './pages/Dasboard'
import Home from './pages/Home'
import UpperItem from './components/sidebar/UpperItem'
import Navbar from './components/ui/Navbar'
import VerifyEmail from './pages/auth/VerifyEmail'
import Register from "./pages/auth/Register"
import GetOtp from './pages/auth/getOtp'
import Login from './pages/auth/Login'
import ReSetPassword from './pages/auth/ReSetPassword'

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex h-screen">
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='register' element={<Register />} />
            <Route path='login' element={<Login />} />
            <Route path='getOtp' element={<GetOtp />} />
            <Route path='verifyEmail' element={<VerifyEmail />} />
            <Route path='ReSetPassword' element={<ReSetPassword />} />
            <Route>
              <Route path='dashboard' element={<><Sidebar /><Navbar /><Dasboard /></>} />
            </Route>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
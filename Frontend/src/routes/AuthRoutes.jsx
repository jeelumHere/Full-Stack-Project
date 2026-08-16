import React from 'react'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ForgetPassword from '../pages/auth/ForgetPassword'
import ReSetPassword from '../pages/auth/ReSetPassword'
import VerifyEmail from '../pages/auth/VerifyEmail'
import VerifyOtp from '../pages/auth/VerifyOtp'
import { Link, Routes, Route } from "react-router-dom"

export const AuthRoutes = [

          <Route path='/register' element={<Register/>} />,
          <Route path='/verifyOtp' element={<VerifyOtp/>} />,
          <Route path='/login' element={<Login/>} />,
          <Route path='/forgotPassword' element={<ForgetPassword/>} />,
          <Route path='/reSetPassword' element={<ReSetPassword/>} />

]

export default AuthRoutes

import React, { useState } from 'react'
import { BrowserRouter, Router, Routes, Route, Navigate } from "react-router-dom"
import Sidebar from './components/ui/Sidebar'
import Dasboard from './pages/Dasboard'
import Home from './pages/Home'
import UpperItem from './components/sidebar/UpperItem'
import Navbar from './components/ui/Navbar'


const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='dashboard' element={<Dasboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
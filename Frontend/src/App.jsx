import React from 'react'
import { BrowserRouter, Router, Routes, Route, Navigate } from "react-router-dom"
import Sidebar from './components/ui/Sidebar'


const App = () => {
  return (
    <>
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    </>
  )
}

export default App
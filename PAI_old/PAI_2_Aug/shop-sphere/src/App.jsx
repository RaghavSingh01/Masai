import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './Navbar'
import Home from './Pages/Home'

function App() {
 

  return (
    <>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        {/* <Route path='/about' element={<AboutUs/>}/>
        <Route path='/contact' element={<ContactUs/>}/> */}
      </Routes>
    </>
  )
}

export default App

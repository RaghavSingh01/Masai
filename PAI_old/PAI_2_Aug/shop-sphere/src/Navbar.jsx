import React from 'react'
import { Routes, Link } from "react-router-dom"
const Navbar = () => {
  return (
   
   <div className = "flex justify-between p-0 bg-amber-300 ">
    <h3 className = "text-brown-600 p-2 left-0  font-serif text-3xl">
     ShopSphere
    </h3>
    <div className='flex gap-5 text-xl'>
    <button className=" hover:bg-amber-800 hover:text-amber-50 p-3 focus:" ><Link to='/'>Home</Link></button>
    <button className= " hover:bg-amber-800 hover:text-amber-50 p-3"><Link to='/cart'>Cart🛒</Link></button>
    </div>
    </div>
  )
}

export default Navbar
